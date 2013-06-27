#!/usr/bin/env node

require('../../..')(module, function (step, request, response) {
  response.setHeader("Content-Type", "text/plain");
  response.write(JSON.stringify(request.url.query || {}) + '\n');
  response.end();
});
