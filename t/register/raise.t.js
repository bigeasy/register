require('proof')(3, function (step, equal, say) {
    var request = require('../../request')(__dirname)
    step(function () {
        request('fixtures//raise', {}, step())
    }, function (statusCode, headers, body) {
        equal(statusCode, 403, 'status code')
        equal(headers['x-nastygram'], 'Go away!', 'headers')
        body.setEncoding('utf8')
        equal(body.read(), '403 Forbidden\n', 'body')
    })
})