var stream = require('stream'),
    ok = require('assert'),
    connect = require('connect'),
    cadence = require('cadence'),
    __slice = [].slice;

function parameterize (program, context) {
  var $ = /^function\s*[^(]*\(([^)]*)\)/.exec(program.toString());
  ok($, "bad function");
  return $[1].trim().split(/\s*,\s*/).map(function (parameter) {
    return context[parameter];
  });
}

var middleware = [ connect.bodyParser(), connect.query() ];

function pipeline (methods, request, response, callback) {
  if (methods.length) {
    var method = methods.shift();
    method(request, response, function (error) {
      if (error) callback(error);
      else pipeline(methods, request, response, callback);
    });
  } else {
    callback(null, request, response);
  }
}

function execute () {
  var vargs = __slice.call(arguments),
      caller = vargs.shift(), program = vargs.shift();

  var script = cadence(function (step, options) {
    var context = { step: step };

    context.request = options.request;
    context.response = options.response;

    step(function () {
      pipeline(middleware.slice(), context.request, context.response, step());
    }, function () {
      context.request.params = context.request.query;
      program.apply(this, parameterize(program, context));
/*    }, function () {
      step(null), headers, output);*/
    });
  });

  caller.exports = script;
}

module.exports = execute;
