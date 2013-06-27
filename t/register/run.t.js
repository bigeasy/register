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

require('proof')(2, function (step, equal, say) {
  step(function () {
    var hello = path.join(__dirname, 'fixtures/hello.cgi.js');
    execute(hello, [], '', step());
  }, function (code, stdout, stderr) {
    equal(stdout, 'Content-Type: text/plain\n\nHello, World!\n', 'execute');
  }, function () {
    var params = path.join(__dirname, 'fixtures/params.cgi.js');
    execute(params, [ 'a==1', 'b=a b' ], '', step());
  }, function (code, stdout, stderr) {
    equal(stdout, 'Content-Type: text/plain\n\n{"a":"=1","b":"a b"}\n', 'params');
  });
});
