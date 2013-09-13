var fs = require('fs'), path = require('path')

require('proof')(5, function (step, ok, equal) {
    var run = require('../../register.bin'), stream = require('stream')
    step(function () {
        var stdout
        step(function () {
            stdout = new stream.PassThrough
            run([ './t/register/fixtures/hello.cgi.js' ], null, stdout, null, step())
        }, function () {
            stdout.setEncoding('utf8')
            equal(stdout.read(), 'Hello, World!\n', 'hello')
        }, function () {
            stdout = new stream.PassThrough
            run([ './t/register/fixtures/query.cgi.js', 'a==1', 'b=a b' ], null, stdout, null, step())
        }, function () {
            stdout.setEncoding('utf8')
            equal(stdout.read(), '{"a":"=1","b":"a b"}\n', 'query')
        }, function () {
            console.log('here')
            stdout = new stream.PassThrough
            run([ './t/register/fixtures' ], null, stdout, null, step())
        }, function (server) {
            stdout.setEncoding('utf8')
            ok(/server pid \d+ listening at 8386/.test(stdout.read()), 'start server')
            server.close()
            server.on('close', step(-1))
        }, [function () {
            console.log('there')
            run([ './t/register/fixtures/missing.cgi.js' ], null, null, null, step())
        }, function (_, error) {
            equal(error.message, 'path not found', 'path not found')
        }], [function () {
          var stderr = new stream.PassThrough
            run([], null, null, null, step())
        }, function (_, error) {
            equal(error.message, 'path required', 'path not found')
        }])
    })
})
