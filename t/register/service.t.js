#!/usr/bin/env node

require('proof')(1, function (step, equal) {
  var connect = require('connect'), http = require('http'), path = require('path'), app;
  step(function () {
    app = connect()
      .use(require('../../service').create(path.join(__dirname, 'fixtures')))
      .listen(8082);
/*    on(app, 'listen');
  }, function () {
    var on = step('on');*/
    var req = http.get("http://127.0.0.1:8082/hello");
    req.on('response', step.event());
    req.on('error', step.error());
  }, function (message) {
    message.setEncoding('utf8');
    message.on('data', step.event([]));
    message.on('end', step.event());
    message.on('error', step.error());
  }, function (data) {
    equal(data.join(''), 'Hello, World!\n', 'connect');
    app.close();
  });
});
