#!/usr/bin/env node

var fs = require('fs'), path = require('path'), stream = require('stream');

require('proof')(2, function (step, deepEqual, say) {
  var out = new stream.PassThrough();
  require('./fixtures/hello.js')({}, function (error, headers, body) {
    if (error) throw error;
    body.setEncoding('utf8');
    deepEqual(headers, { 'Content-Type': [ 'text/plain' ] }, 'headers');
    deepEqual(body.read(), 'Hello, World!\n', 'body');
  });
});
