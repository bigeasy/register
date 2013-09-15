require('./proof')(1, function (step, once, deepEqual) {
    step(function () {
        once(step, 'fixtures//load', [])
    }, function (response) {
        deepEqual(JSON.parse(response.body), { loaded: true }, 'body')
    })
})
