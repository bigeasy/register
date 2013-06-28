#!/usr/bin/env node

require('../../..')(module, function (step, response) {
  throw new Error('errored');
});
