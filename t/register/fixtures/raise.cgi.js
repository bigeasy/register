on.get(function (raise) {
    raise(302, { location: '/hello' })
    throw new Error
})
