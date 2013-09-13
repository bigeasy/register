var path    = require('path')
var fs      = require('fs')
var http    = require('http')
var __slice = [].slice

var cadence = require('cadence')
var connect = require('connect')

function httpStatusMessage(statusCode) {
    return statusCode + ' ' + http.STATUS_CODES[statusCode] + '\n'
}

exports.createServer = function (port, directory, probe, callback) {
    var server = http.createServer()

    var routes = exports.routes(directory)
    server.on('request', function (request, response) {
        routes(request, response, function (error, matched) {
            if (error) server.emit('error', error)
            else if (!matched) {
                response.statusCode = 404
                response.setHeader('content-type', 'text/plain; charset=utf8')
                response.end(httpStatusMessage(404), 'utf8')
            }
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

exports.argvParser = function (cwd, file, args) {
    args = args.slice()
    var url = require('url')
    var object = { method: 'get' }
    var parsed, $

    if ($ = /^(.*?)\/\/(.*)$/.exec(file)) {
        object.directory = path.resolve(cwd, $[1])
        file = $[2]
    } else {
        object.directory = path.resolve(cwd, path.dirname(file))
        file = path.basename(file)
    }

    if (args[0] && /^[a-z]{3,}$/i.test(args[0])) {
        object.method = args.shift().toLowerCase()
    }

    // todo: no. only invoke as intended. do not specify alternate path.
    if (/^\s*\//.test(args[0]) || /^[^=:]+:/.test(args[0])) {
        parsed = url.parse(args.shift(), true)
    } else {
        parsed = url.parse(file, true)
    }

    args.forEach(function (pair) {
        var $ = /^([^=]*)(?:=(.*))$/.exec(pair)
        parsed.query[$[1]] = $[2]
    })

    delete parsed.search

    object.url = url.parse(url.format(parsed), true)

    return object
}

function Register (file) {
    this._file = file
    this._handlers = {}
}

'any get post put'.split(/\s/).forEach(function (verb) {
    Register.prototype[verb] = function (handler) {
        this._handlers[verb] = handler
        return this
    }
})

function parameterize (program, context) {
    var $ = /^function\s*[^(]*\(([^)]*)\)/.exec(program.toString())
    return $[1].trim().split(/\s*,\s*/).map(function (parameter) {
        return context[parameter]
    })
}

var compiled = []

function raise (statusCode, headers) {
    var error = new Error
    error.statusCode = statusCode
    if (headers) {
        error.headers = headers
    }
    throw error
}

exports.routes = function routes (base) {
    var find = require('avenue')
    var path = require('path')

    var url = require('url')
    var routes = find(base, 'cgi.js')

    routes.forEach(function (route) {
        var file = path.join(base, route.script)
        if (!compiled[file]) {
            try {
                global.on = compiled[file] = new Register(file)
                require(file)
            } finally {
                delete global.on
            }
        }
    })

    var reactor = require('locate')(routes)

    return cadence(function (step, request, response) {
        var method = request.method.toLowerCase()
        var uri = url.parse(request.url, true)
        var found = reactor(uri.pathname).map(function (match) {
            // todo: resolve?
            var script = path.join(base, match.route.script)
            return {
                params: match.params,
                register: compiled[script]
            }
        }).filter(function (match) {
            return match.register._handlers[method] ||
                   match.register._handlers.any
        })
        function middleware () {
            var methods = __slice.call(arguments)
            var callback = methods.pop()
            var called
            if (methods.length) {
                var method = methods.shift()
                method(request, response, function (error) {
                    called = true
                    response.removeListener('headers', callback)
                    if (error) callback(error)
                    else middleware.apply(this, methods.concat(callback))
                })
                response.on('header', function () {
                    if (!called) process.nextTick(function () {
                        middleware.apply(this, methods.concat(callback))
                    })
                    called = true
                })
            } else {
                callback()
            }
        }
        step(function (match) {
            var context = {
                step: step,
                request: request,
                response: response,
                middleware: middleware,
                raise: raise,
                params: match.params
            }
            step([function () {
                var handler = match.register._handlers[method] ||
                              match.register._handlers.any
                handler.apply(context, parameterize(handler, context))
            }, function (errors, error) {
                if (('statusCode' in error) && !response.headersSent) {
                    var headers = error.headers || {}
                    for (var name in headers) {
                        response.setHeader(name, headers[name])
                    }
                    response.statusCode = error.statusCode
                    response.setHeader('content-type', 'text/html; charset=utf8')
                    response.end(error.body || httpStatusMessage(error.statusCode), 'utf8')
                } else {
                    throw errors
                }
            }], function () {
                if (response.headersSent) step(null, true)
            })
        })(found)
    })
}

// TODO: Probably needs to return an object to shut it down, or an event emitter
// of some kind, so that the caller can handle all errors. A curious case.
exports.once = cadence(function (step, cwd, path, args, stdin) {
    var url = require('url')
    var request = require('request')
    var object = exports.argvParser(cwd, path, args)

    step(function () {
        exports.createServer(8386, object.directory, true, step())
    }, function (server) {
        var parsed = object.url

        parsed.protocol = 'http'
        parsed.hostname = '127.0.0.1'
        parsed.port = server.address().port

        var req = request({ method: object.method, timeout: 1000, uri: url.format(parsed) })

        server.once('error', step(Error))
        req.on('error', step(Error))

        if (object.method != 'get') {
            stdin.pipe(req)
        } else {
            req.end()
        }

        step(function () {
            req.on('response', step(-1))
        }, function (response) {
            step(null, response, server)
            server.close()
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
        }], function (stat) {
            if (stat.isDirectory() && ! /\/\//.test(location)) {
                step(function () {
                    exports.createServer(8386, path.resolve(process.cwd(), location), true, step())
                }, function (server) {
                    stdout.write('server pid ' + process.pid + ' listening at ' + server.address().port)
                    return server
                })
            } else {
                step(function () {
                    location = location.replace(/\.cgi\.js$/, '')
                    exports.once(process.cwd(), location, options.argv, stdin, step())
                }, function (request) {
                    request.pipe(stdout)
                    request.on('end', step(-1))
                })
            }
        })
    })
})
