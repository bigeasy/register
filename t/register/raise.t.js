require('proof')(5, function (step, equal, say) {
    var request = require('../../request')(__dirname)
    step(function () {
        request('fixtures//raise', { header: 'X-NastyGram=Go away!' }, step())
    }, function (statusCode, headers, body) {
        equal(statusCode, 403, 'status code')
        equal(headers['x-nastygram'], 'Go away!', 'headers')
        body.setEncoding('utf8')
        equal(body.read(), '403 Forbidden\n', 'body')
    }, function () {
        request('fixtures//raise', {}, step())
    }, function (statusCode, headers, body) {
        equal(statusCode, 403, 'status code no headers')
        body.setEncoding('utf8')
        equal(body.read(), '403 Forbidden\n', 'body no headers')
    })
})
