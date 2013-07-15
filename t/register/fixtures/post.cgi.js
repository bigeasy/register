require('../../..')(module, function (step, request, response) {
    response.setHeader("Content-Type", "text/plain")
    response.end(JSON.stringify({ a: 1 }))
})
