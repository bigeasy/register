require('./proof')(3, function (step, once, deepEqual) {
    step(function () {
        once(step, 'fixtures//janitor', [])
    }, function (response) {
        deepEqual(response.headers['content-type'], 'application/json', 'content type')
        deepEqual(JSON.parse(response.body), { count: 0 }, 'body')
        once(step, 'fixtures//janitor', [])
    }, function (response) {
        deepEqual(JSON.parse(response.body), { count: 1 }, 'body')
    })
})
