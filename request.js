var url = require('url');

module.exports = function (require) {
  return function (script, parameters, callback) {
    var request = {};
    request.url =  url.parse(url.format({ pathname: script, query: parameters }), true);
    request.params =  request.url.query;
    require(script)({ request: request }, callback);
  }
}
