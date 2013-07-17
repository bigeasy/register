#!/usr/bin/env node

var request = require('../../request')(__dirname)

require('proof')(2, function (step, deepEqual, say) {
    step(function () {
        request('/fixtures/redirect', { to: '/fixtures/hello' }, step())
    }, function (statusCode, headers, body) {
        deepEqual(headers['content-type'], 'text/plain', 'headers')
        body.setEncoding('utf8')
        deepEqual(body.read(), 'Hello, World!\n', 'body')
    })
})
