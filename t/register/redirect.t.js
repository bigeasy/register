#!/usr/bin/env node

var request = require('../../request')

require('proof')(2, function (step, deepEqual, say) {
    step(function () {
        request(__dirname + '/fixtures//redirect', [ 'to=/hello' ], step())
    }, function (request) {
        deepEqual(request.headers['content-type'], 'text/plain', 'headers')
        deepEqual(request.body, 'Hello, World!\n', 'body')
    })
})
