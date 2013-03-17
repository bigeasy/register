#!/usr/bin/env node

require('../../..')(function (step, response) {
  var fs = require('fs');

  step(function () {

    fs.readFile(__filename, step()); 

  }, function (body) {

    response.setHeader("Content-Type", "text/plain");
    response.end(body);

  });
});
