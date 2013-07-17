var url = require('url')
var once = require('./register').once
var stream = require('stream')

module.exports = function (dirname) {
    return function (script, parameters, callback) {
        var argv = []
        for (var key in parameters) {
            argv.push(key + '=' + parameters[key])
        }
        once(dirname, script, argv, null, function (error, request) {
            if (error) throw error
            request.on('error', function (error) {
                callback(error)
                callback = null
            })
            var stdout = new stream.PassThrough
            request.pipe(stdout)
            request.on('end', function () {
                if (callback) callback(null, request.headers, stdout)
            })
        })
    }
}
