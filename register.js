var cadence = require('cadence')
var fs = require('fs')
var path = require('path')

exports.createServer = function (port, directory, probe, callback) {
    var http = require('http')
    var server = http.createServer()

    var routes = exports.routes(directory)
    server.on('request', function (request, response) {
        routes(request, response, function (error) {
            if (error) throw error
        })
    })

    server.on('error', nextPort)

    function nextPort (e) {
        if (!probe || e.code != 'EADDRINUSE') callback(e)
        else server.listen(++port, '127.0.0.1')
    }

    server.on('listening', function () {
        server.removeListener('error', nextPort)
        callback(null, server)
    })

    server.listen(port, '127.0.0.1')
}

exports.argvParser = function (path, args) {
    args = args.slice()
    var url = require('url')
    var parsed
    var object = { method: 'get' }

    if (args[0] && /^[a-z]{3,}$/i.test(args[0])) {
        object.method = args.shift().toLowerCase()
    }

    if (/^\s*\//.test(args[0]) || /^[^=:]+:/.test(args[0])) {
        parsed = url.parse(args.shift(), true)
    } else {
        parsed = url.parse(path, true)
    }

    args.forEach(function (pair) {
        var $ = /^([^=]*)(?:=(.*))$/.exec(pair)
        parsed.query[$[1]] = $[2]
    })

    delete parsed.search

    object.url = url.parse(url.format(parsed), true)

    return object
}

exports.routes = function routes (base) {
    var find = require('avenue')
    var path = require('path')

    var url = require('url')
    var routes = find(base, 'cgi.js')
    var compiled = {}

    routes.forEach(function (route) {
        var file = path.join(base, route.script)
        compiled[file] = require(file)
    })

    var reactor = require('locate')(routes)

    return function (request, response, callback) {
        var uri = url.parse(request.url, true)
        var found = reactor(uri.pathname)
        // todo: multiple matches, sort out relative paths.
        var script = path.join(base, found[0].route.script)
        if (!found.length) callback(null, false)
        else compiled[script]({ request: request, response: response }, function (error) {
            if (error) {
                if (('statusCode' in error) && !response.headersSent) {
                    var headers = error.headers || {}
                    for (var name in headers) {
                        response.setHeader(name, headers[name])
                    }
                    response.statusCode = error.statusCode
                    response.setHeader('content-type', 'text/html; charset=utf8')
                    response.end(error.body || '', 'utf8')
                } else {
                    callback(error)
                }
            } else {
                callback(null, true)
            }
        })
    }
}

// TODO: Probably needs to return an object to shut it down, or an event emitter
// of some kind, so that the caller can handle all errors. A curious case.
exports.once = cadence(function (step, cwd, path, args, stdin) {
    var url = require('url')
    var request = require('request')

    step(function () {
        exports.createServer(8386, cwd, true, step())
    }, function (server) {
        function close () { server.close() }

        server.on('error', function () { throw new Error })

        var object = exports.argvParser(path, args)
        var parsed = object.url

        parsed.protocol = 'http'
        parsed.hostname = '127.0.0.1'
        parsed.port = server.address().port

        var req = request({ method: object.method, timeout: 1000, uri: url.format(parsed) })

        req.on('error', step(Error))
        req.on('end', close)

        if (object.method != 'get') {
            stdin.pipe(req)
        } else {
            req.end()
        }

        step(function () {
            req.on('response', step(-1))
        }, function (response) {
            return response
        })
    })
})

exports.runner = cadence(function (step, options, stdin, stdout, stderr) {
    var directory
    var location

    if (!options.argv.length) options.abend('path required')

    step(function () {
        location = options.argv.shift()
        step([function () {
            fs.stat(location, step())
        }, /^ENOENT$/, function () {
            options.abend('path not found', location)
        }], function (loc) {
            if (loc.isDirectory()) {
                directory = location
                location = null
            } else {
                directory = path.dirname(location)
                location = path.basename(location).replace(/\.cgi\.js$/, '')
            }
            directory = path.resolve(process.cwd(), directory)
            if (location) step(function () {
                exports.once(path.resolve(process.cwd(), directory), location, options.argv, stdin, step())
            }, function (request) {
                request.pipe(stdout)
                request.on('end', step(-1))
            })
            else step(function () {
                exports.createServer(8386, directory, true, step())
            }, function (server) {
                stdout.write('server pid ' + process.pid + ' listening at ' + server.address().port)
                return server
            })
        })
    })
})
