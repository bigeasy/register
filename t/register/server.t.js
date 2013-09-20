require('proof')(2, function (step, equal, ok) {
    var createServer = require('../../register').createServer,
        path = require('path'),
        directory = path.join(__dirname, '/fixtures')
    step(function () {
        createServer(8386, [ directory ], true, step())
    }, function (first) {
        var port = first.address().port
        step(function () {
            createServer(8386, [ directory ], true, step())
        }, [function (second) {
            ok(port < second.address().port, 'probed')
            second.close()
            createServer(8386, [ directory ], false, step())
        }, function (_, error) {
            equal(error.code, 'EADDRINUSE', 'address in use')
            first.close()
        }])
    })
})
