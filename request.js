var register = require('./register')
var stream = require('stream')
var cadence = require('cadence')

module.exports = cadence(function (step, directory, argv, stdin) {
    step(function () {
        register.once(__dirname, directory, argv, stdin, step())
    }, function (request, server) {
        var stdout = new stream.PassThrough
        stdout.setEncoding('utf8')
        step(function () {
            request.pipe(stdout)
            request.on('end', step(-1))
            if (!server.closed) server.on('close', step(-1))
        }, function () {
            return {
                statusCode: request.statusCode,
                headers: request.headers,
                body: stdout.read()
            }
        })
    })
})
