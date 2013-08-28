require('./proof')(1, function (step, once, equal) {
    step(function () {
        once(step, 'fixtures//hello', [])
    }, function (response) {
        equal(response.body, 'Hello, World!\n', 'delimiter')
    })
})
