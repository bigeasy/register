on.get(function (request) {
    var error = new Error
    error.statusCode = 302
    error.headers = { location: request.query.to }
    throw error
})
