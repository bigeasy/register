on.get(function (middleware, step) {
    middleware(function (request, response, next) {
        var error = new Error
        error.statusCode = 403
        next(error)
    }, step())
})
