require('./proof')(1, function (step, once, equal) {
    var stream = require('stream')
    step([function () {
        once(step, 'fixtures//exception', [])
    }, function (errors, error) {
        equal(error.message, 'exception', 'error')
    }])
})
