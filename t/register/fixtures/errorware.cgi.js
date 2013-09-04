on.get(function (middleware, step) {
    middleware(function () {
        var error = new Error
        error.statusCode = 403
        throw error
    }, step())
})
