#!/usr/bin/env node

require('proof')(1, function (step, equal) {
    var connect = require('connect'), http = require('http'), path = require('path'), app;
    step(function () {
        app = connect()
          .use(require('../../service').create(path.join(__dirname, 'fixtures')))
          .listen(8082);
        var req = http.get("http://127.0.0.1:8082/hello");
        req.on('response', step(-1));
        req.on('error', step(Error));
    }, function (message) {
        message.setEncoding('utf8');
        message.on('data', step(-1, []));
        message.on('end', step(-1));
        message.on('error', step(Error));
    }, function (data) {
        equal(data.join(''), 'Hello, World!\n', 'connect');
        app.close();
    });
});
