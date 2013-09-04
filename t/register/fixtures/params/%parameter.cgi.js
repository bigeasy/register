on.get(function (params, response) {
    response.setHeader("Content-Type", "text/plain")
    response.write(JSON.stringify(params) + '\n')
    response.end()
})
