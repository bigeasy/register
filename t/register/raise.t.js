require('proof')(5, function (step, equal, say) {
    var request = require('../../request')
    step(function () {
        request(__dirname + '/fixtures//raise', [ 'header=X-NastyGram=Go away!' ], step())
    }, function (response) {
        equal(response.statusCode, 403, 'status code')
        equal(response.headers['x-nastygram'], 'Go away!', 'headers')
        equal(response.body, '403 Forbidden\n', 'body')
    }, function () {
        request(__dirname + '/fixtures//raise', [], step())
    }, function (request) {
        equal(request.statusCode, 403, 'status code no headers')
        equal(request.body, '403 Forbidden\n', 'body no headers')
    })
})
