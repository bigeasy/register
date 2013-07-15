var url = require('url')

module.exports = function (require) {
    return function (script, parameters, callback) {
        var request = {}
        request.url =  url.format({ pathname: script, query: parameters })
        require(script)({ request: request }, callback)
    }
}
