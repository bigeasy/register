require('proof')(2, function (step, deepEqual, ok) {
    var once = require('../../register').once
    var stream = require('stream')
    step(function () {
        once(__dirname, 'fixtures//query', {}, ['a=b'], null, step())
    }, function (response) {
        deepEqual(response.headers['content-type'], 'text/plain', 'content type')

        var output = new stream.PassThrough()
        output.setEncoding('utf8')
        response.pipe(output)
        step(function () {
            response.on('end', step(-1))
        }, function () {
            deepEqual(JSON.parse(output.read()), { a: 'b' }, 'body')
        })
    })
})
