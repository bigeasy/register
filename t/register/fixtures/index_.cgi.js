var connect = require('connect')
var query = connect.query()
var path = require('path')
var files = connect.static(path.join(__dirname, 'public'))

on.any(function (middleware, step) { middleware(query, files, step()) })
