#!/usr/bin/env node

require('../../..')(module, function (step, request, response) {
  response.setHeader("Content-Type", "text/plain");
  response.write(JSON.stringify(request.params || {}) + '\n');
  response.end();
});
