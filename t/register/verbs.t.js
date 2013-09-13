require('./proof')(2, function (step, once, deepEqual, ok) {
    var stream = require('stream')
    step(function () {
        var input = new stream.PassThrough()
        input.end('a=1', 'utf8')
        once(step, 'fixtures//verb', ['put'], input)
    }, function (response) {
        deepEqual(response.headers['content-type'], 'text/plain', 'content type')
        deepEqual(JSON.parse(response.body), { method: "PUT" }, 'body')
    })
})