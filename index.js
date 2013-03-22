var cadence = require('cadence'), ok = require('assert'), __slice = [].slice;

var __slice = [].slice;

function die () {
  console.log.apply(console, __slice.call(arguments, 0));
  process.exit(1);
}

function say () { console.log.apply(console, __slice.call(arguments, 0)) }


function parameterize (program, context) {
  var $ = /^function\s*[^(]*\(([^)]*)\)/.exec(program.toString());
  ok($, "bad function");
  return $[1].trim().split(/\s*,\s*/).map(function (parameter) {
    return context[parameter];
  });
}

function serve (vargs) {
  var program = vargs.shift();

  var handler = cadence(function (step, request, response) {
    var context = { step: step, request: request, response: response };
    step(function () {
      program.apply(this, parameterize(program, context));
    });
  });

  results.push(handler);
}

var results = [];

function execute (vargs) {
  if (!vargs.length) {
    register = serve;
    return results;
  }

  var program = vargs.shift();

  cadence(function (step) {
    var context = {};
    context.step = step;
    context.response = {
      headers: {},
      setHeader: function (header, value) {
        this.headers[header] = value;
      },
      end: function (value) {
        process.stdout.write(value);
      }
    }
    step(function () {
      program.apply(this, parameterize(program, context));
    });
  }).call({}, function (error) {
    if (error) throw error;
  });
}

var register = execute;

function bootstrap () { return register(__slice.call(arguments)) }

module.exports = bootstrap;
