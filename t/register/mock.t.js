#!/usr/bin/env node

var request = require('../../request')(__dirname)

require('proof')(4, function (step, deepEqual, say) {
    step(function () {
        request('fixtures//hello', {}, step())
    }, function (statusCode, headers, body) {
        body.setEncoding('utf8')
        deepEqual(headers['content-type'], 'text/plain', 'hello header')
        deepEqual(body.read(), 'Hello, World!\n', 'hello body')
    }, function () {
        request('fixtures//query', { a: 1 }, step())
    }, function (statusCode, headers, body) {
        body.setEncoding('utf8')
        deepEqual(headers['content-type'], 'text/plain', 'param header')
        deepEqual(JSON.parse(body.read()), { a: 1 }, 'param body')
    })
})
