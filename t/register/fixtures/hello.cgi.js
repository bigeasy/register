#!/usr/bin/env node

require('../../..')(module, function (step, response) {
  response.setHeader("Content-Type", "text/plain");
  response.end("Hello, World!\n");
});
