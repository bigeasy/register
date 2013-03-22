#!/usr/bin/env node

var fs = require('fs'), spawn = require('child_process').spawn, path = require('path');

function execute (program, parameters, input, callback) {
  var stdout = [], stderr = [], proc = spawn(program, parameters), count = 0;
  proc.stderr.setEncoding('utf8');
  proc.stderr.on('data', function (chunk) { stderr.push(chunk) });
  proc.stdout.setEncoding('utf8');
  proc.stdout.on('data', function (chunk) { stdout.push(chunk) });
  proc.on('close', function (code) {
    callback(null, code, stdout.join(''), stderr.join(''));
  });
}

require('proof')(1, function (step, equal, say) {
  step(function () {
    var hello = path.join(__dirname, 'fixtures/hello.js');
    execute(hello, [], '', step());
  }, function (code, stdout, stderr) {
    equal(stdout, 'Hello, World!\n', 'execute');
  });
});
