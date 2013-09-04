require('./proof')(2, function (step, once, equal) {
    var stream = require('stream')
    step(function () {
        once(step, 'fixtures//params/10', [])
    }, function (response) {
        equal(response.statusCode, 200, 'status code')
        equal(response.body, '{"parameter":"10"}\n', 'body')
    })
})
