#!/usr/bin/env node

require('proof')(1, function (step, equal) {
  var connect = require('connect'), http = require('http'), path = require('path'), app;
  step(function () {
    var on = step('on');
    app = connect()
      .use(require('../../service').create(path.join(__dirname, 'fixtures')))
      .listen(8082);
/*    on(app, 'listen');
  }, function () {
    var on = step('on');*/
    var req = http.get("http://127.0.0.1:8082/hello");
    on(req, 'response');
    on(req, 'error');
  }, function (message) {
    var on = step('on');
    message.setEncoding('utf8');
    on(message, 'data', []);
    on(message, 'end');
  }, function (data) {
    equal(data.join(''), 'Hello, World!\n', 'connect');
    app.close();
  });
});
