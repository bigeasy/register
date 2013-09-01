var connect = require('connect')
var query = connect.query()

on.get(function (middleware, step) { middleware(query, step()) })
