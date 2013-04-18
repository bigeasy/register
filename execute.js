var stream = require('stream'),
    ok = require('assert'),
    cadence = require('cadence'),
    __slice = [].slice;

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
  var caller = vargs.shift(), program = vargs.shift();

  var script = cadence(function (step, options) {
    var context = { headers: {}, step: step };
    if (options.response && options.request) {
      context.request = options.request;
      context.response = options.response;
    } else {
      context.step = step;
      context.response = {
        headers: {},
        setHeader: function (header, value) {
          this.headers[header] = value;
        },
        sendHeaders: function () {
          var keys = Object.keys(this.headers);
          keys.forEach(function (key) {
            options.out.write(key + ': ' + context.response.headers[key] + '\n');
          });
          if (keys.length) {
            options.out.write('\n');
          }
          keys.length = 0;
        },
        write: function () {
          this.sendHeaders();
          options.out.write.apply(options.out, arguments)
        },
        end: function () {
          this.sendHeaders();
          options.out.end.apply(options.out, arguments)
        }
      }
    }
    step(function () {
      program.apply(this, parameterize(program, context));
    });
  });
  /*.call({}, function (error) {
    if (error) throw error;
  });*/

  if (caller === require.main) {
    var pipe = new stream.PassThrough();
    pipe.pipe(process.stdout);
    script({ out: pipe }, function (error) {
      if (error) throw error;
    });
  } else {
    caller.exports = script;
  }
}

var register = execute;

function bootstrap () { return register(__slice.call(arguments)) }

exports.index = bootstrap;
exports.execute = execute;
