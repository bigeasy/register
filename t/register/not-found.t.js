require('./proof')(1, function (step, once, equal) {
    step(function () {
        once(step, 'fixtures//missing', [])
    }, function (response) {
        equal(response.statusCode, 404, 'missing')
    })
})
