on.put(function (request, response) {
    response.setHeader("Content-Type", "text/plain")
    response.end(JSON.stringify({ method: request.method }))
})

on.delete(function (request, response) {
    response.setHeader("Content-Type", "text/plain")
    response.end(JSON.stringify({ method: request.method }))
})

on.patch(function (request, response) {
    response.setHeader("Content-Type", "text/plain")
    response.end(JSON.stringify({ method: request.method }))
})
