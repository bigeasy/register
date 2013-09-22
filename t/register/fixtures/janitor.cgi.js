var count = 0

on.get(function (response, janitor) {
    janitor(function () { count++ })
    response.setHeader("Content-Type", "application/json")
    response.end(JSON.stringify({ count: count }))
})
