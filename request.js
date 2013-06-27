var url = require('url');

module.exports = function (require) {
  return function (script, parameters, callback) {
    var request = {
      url: url.parse(url.format({ pathname: script, query: parameters }), true)
    };
    require(script)({ request: request }, callback);
  }
}
