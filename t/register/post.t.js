require('proof')(2, function (step, deepEqual, ok) {
    var once = require('../../register').once
    var stream = require('stream')
    step(function () {
        var input = new stream.PassThrough()
        input.end('a=1', 'utf8')
        once(__dirname, 'fixtures//post', {}, ['post'], input, step())
    }, function (response) {
        deepEqual(response.headers['content-type'], 'text/plain', 'content type')

        var output = new stream.PassThrough()
        output.setEncoding('utf8')
        response.pipe(output)
        step(function () {
            response.on('end', step(-1))
        }, function () {
            deepEqual(output.read(), '{"a":1}', 'body')
        })
    })
})
