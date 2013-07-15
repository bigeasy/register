#!/usr/bin/env node

require('proof')(2, function (step, deepEqual, ok) {
    var once = require('../../register').once, stream = require('stream')
    step(function () {
        once(__dirname, '/fixtures/params', ['a=b'], step())
    }, function (request) {
        deepEqual(request.response.headers['content-type'], 'text/plain', 'content type')

        var output = new stream.PassThrough()
        output.setEncoding('utf8')
        request.pipe(output)
        step(function () {
            request.on('end', step(-1))
        }, function () {
            deepEqual(JSON.parse(output.read()), { a: 'b' }, 'body')
        })
    })
})
