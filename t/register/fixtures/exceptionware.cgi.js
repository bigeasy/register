on.get(function (middleware, step) {
    middleware(function (request, response, next) { next(new Error('exception')) }, step())
})
