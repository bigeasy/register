#!/usr/bin/env node

require('../../..')(function (step, response) {
  response.setHeader("Content-Type", "text/plain");
  response.end("Hello, World!\n");
});
