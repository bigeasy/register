require('./proof')(1, function (step, once, deepEqual) {
    var path = require('path')
    step(function () {
        once(step, 'fixtures//prepended', { pre: path.join(__dirname, 'prepend') }, [])
    }, function (response) {
        deepEqual(JSON.parse(response.body), { prepended: true }, 'body')
    })
})
