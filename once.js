var register = require('./register')
var stream = require('stream')
var cadence = require('cadence')

module.exports = cadence(function (step, directory, params, argv, stdin) {
    if (Array.isArray(params)) {
        stdin = argv
        argv = params
        params = {}
    }
    step(function () {
        register.once(__dirname, directory, params, argv, stdin, step())
    }, function (request, server) {
        var stdout = new stream.PassThrough
        stdout.setEncoding('utf8')
        step(function () {
            request.pipe(stdout)
            request.on('end', step(-1))
            server.on('close', step(-1))
        }, function () {
            return {
                statusCode: request.statusCode,
                headers: request.headers,
                body: stdout.read()
            }
        })
    })
})
