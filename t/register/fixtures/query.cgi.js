on.get(function (request, response) {
    response.setHeader("Content-Type", "text/plain")
    response.write(JSON.stringify(request.query || {}) + '\n')
    response.end()
})
