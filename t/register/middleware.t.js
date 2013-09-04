require('./proof')(1, function (step, once, equal) {
    var stream = require('stream')
    step(function () {
        once(step, 'fixtures//errorware', [])
    }, function (response) {
        equal(response.statusCode, 403, 'status code')
    })
})
