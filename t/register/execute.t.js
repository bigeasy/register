#!/usr/bin/env node

var fs = require('fs'), path = require('path');

require('proof')(1, function (step, equal, say) {
  var output = [];
  var out = {
    write: function (string) { output.push(string) }
  };
  var execute = require('../../execute').execute;
  execute([function (response) {
    response.setHeader('Content-Type', 'text/plain');
    response.write('Hello, World!\n');
  }], out);
  equal(output.join(''), 'Content-Type: text/plain\n\nHello, World!\n', 'execute');
});
