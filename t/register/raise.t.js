require('proof')(2, function (step, deepEqual, say) {
    var request = require('../../request')(__dirname)
    step(function () {
        request('fixtures//raise', {}, step())
    }, function (statusCode, headers, body) {
        deepEqual(headers['content-type'], 'text/plain', 'headers')
        body.setEncoding('utf8')
        deepEqual(body.read(), 'Hello, World!\n', 'body')
    })
})
