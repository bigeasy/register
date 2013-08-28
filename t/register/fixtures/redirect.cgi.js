on.get(function (request, raise) {
    raise(302, { location: request.query.to })
})
