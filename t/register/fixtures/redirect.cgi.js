require('../../..')(module, function (request) {
    var error = new Error
    error.statusCode = 302
    error.headers = { location: request.params.to }
    throw error
})
