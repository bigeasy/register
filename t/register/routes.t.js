#!/usr/bin/env node

require('proof')(2, function (step, equal, ok) {
    var routes = require('../../register').routes(__dirname)
    step([function () {
        routes({ method: 'GET', url: '/fixtures/error' }, {}, step())
    }, function (_, error) {
        equal(error.message, 'errored', 'route error')
    }], function () {
        routes({ method: 'GET', url: '/missing' }, {}, step())
    }, function (found) {
        ok(!found, 'not found')
    })
})
