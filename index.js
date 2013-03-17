var cadence = require('cadence'), ok = require('assert'), __slice = [].slice;

module.exports = function (program) {
  function parameterize (step, context) {
    var $ = /^function\s*[^(]*\(([^)]*)\)/.exec(program.toString());
    ok($, "bad function");
    return $[1].trim().split(/\s*,\s*/).map(function (parameter) {
      return context[parameter];
    });
  }

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
