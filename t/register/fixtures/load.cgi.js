var loaded

on.load(function () {
    loaded = true
})

on.get(function (request, response) {
    response.setHeader("Content-Type", "text/plain")
    response.end(JSON.stringify({ loaded: loaded }))
})
