require('./proof')(4, function (step, once, equal) {
    step([function () {
        once(step, 'fixtures//exceptionware', [])
    }, function (errors, error) {
        equal(error.message, 'exception', 'exceptional')
    }], function () {
        once(step, 'fixtures//errorware', [])
    }, function (response) {
        equal(response.statusCode, 403, 'error status code')
        once(step, 'fixtures//hello.txt', [])
    }, function (response) {
        equal(response.statusCode, 200, 'static status code')
        equal(response.body, 'Hello, World!\n', 'body')
    })
})
