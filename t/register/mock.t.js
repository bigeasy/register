#!/usr/bin/env node

var fs = require('fs'), path = require('path'), stream = require('stream'),
    request = require('../../request')(require);

require('proof')(4, function (step, deepEqual, say) {
  request('./fixtures/hello.cgi.js', {}, function (error, headers, body) {
    if (error) throw error;
    body.setEncoding('utf8');
    deepEqual(headers, { 'Content-Type': [ 'text/plain' ] }, 'headers');
    deepEqual(body.read(), 'Hello, World!\n', 'body');
  });
  request('./fixtures/params.cgi.js', { a: 1 }, function (error, headers, body) {
    if (error) throw error;
    body.setEncoding('utf8');
    deepEqual(headers, { 'Content-Type': [ 'text/plain' ] }, 'param headers');
    deepEqual(JSON.parse(body.read()), { a: 1 }, 'param body');
  });
});
