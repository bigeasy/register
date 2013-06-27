#!/usr/bin/env node

require('proof')(2, function (step, equal, ok) {
  var createServer = require('../../register').createServer;
  step(function () {
    createServer(8386, true, step());
  }, function (first) {
    var port = first.address().port;
    step(function () {
      createServer(8386, true, step());
    }, function (second) {
      ok(port < second.address().port, 'probed');
      second.close();
      createServer(8386, false, step(Error));
    }, function (error) {
      equal(error.code, 'EADDRINUSE', 'address in use');
      first.close();
    });
  });
});
