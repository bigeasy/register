on.get(function (request, response) {
    console.log('foo foo foo')
    response.setHeader("Content-Type", "text/plain")
    response.write(JSON.stringify(request.params) + '\n')
    response.end()
})
