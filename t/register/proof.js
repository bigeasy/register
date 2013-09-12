module.exports = require('proof')(function () {
    var register = require('../../register')
    var stream = require('stream')
    var path = require('path')
    var once = require('../../once')
    return {
        once: function (step, path, parameters, stdin) {
            return once(__dirname + '/' + path, parameters, stdin, step())
        }
    }
})
