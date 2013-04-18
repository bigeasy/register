var stream = require('stream'),
    ok = require('assert'),
    cadence = require('cadence'),
    __slice = [].slice;

/*
function die () {
  console.log.apply(console, __slice.call(arguments, 0));
  process.exit(1);
}

function say () { console.log.apply(console, __slice.call(arguments, 0)) }
*/

function parameterize (program, context) {
  var $ = /^function\s*[^(]*\(([^)]*)\)/.exec(program.toString());
  ok($, "bad function");
  return $[1].trim().split(/\s*,\s*/).map(function (parameter) {
    return context[parameter];
  });
}

function execute (vargs) {
  var caller = vargs.shift(), program = vargs.shift();

  var script = cadence(function (step, options) {
    var context = { headers: {}, step: step };
    if (options.response && options.request) {
      context.request = options.request;
      context.response = options.response;
    } else {
      var headers = {}, headersSent = ! options.printHeaders, sendHeaders,
          output = options.output || new stream.PassThrough;
      if (require.main === caller) {
        sendHeaders = function () {
          var keys = Object.keys(headers);
          keys.forEach(function (key) {
            headers[key].forEach(function (value) {
              output.write(key + ': ' + value + '\n');
            });
          });
          if (keys.length) {
            output.write('\n');
          }
        }
      } else {
        sendHeaders = function () {}
      }

      context.step = step;
      context.response = {
        setHeader: function (header, value) {
          headers[header] = Array.isArray(value) ? value : [value];
        },
        write: function () {
          if (!headersSent) sendHeaders();
          headersSent = true;
          output.write.apply(output, arguments)
        },
        end: function () {
          if (!headersSent) sendHeaders();
          headersSent = true;
          output.end.apply(output, arguments)
        }
      }
    }
    step(function () {
      program.apply(this, parameterize(program, context));
    }, function () {
      step(null, headers, output);
    });
  });

  if (caller === require.main) {
    var output = new stream.PassThrough();
    output.pipe(process.stdout);
    script({ output: output, printHeaders: true }, function (error) {
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
