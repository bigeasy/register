on.get(function (request, raise) {
    if (request.query.header) {
        var $ = request.query.header.split(/=/)
        var headers = {}
        headers[$[0]] = $[1]
        raise(403, headers)
    } else {
        raise(403)
    }
})
