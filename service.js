var find = require('reactor/find'), registered = require('./index')(), path = require('path'),
  reactor = require('reactor').createReactor(), url = require('url');

var __slice = [].slice;

function die () {
  console.log.apply(console, __slice.call(arguments, 0));
  process.exit(1);
}

function say () { console.log.apply(console, __slice.call(arguments, 0)) }

var compiled = {};

exports.create = function (base) {
  var routes = find(base, 'js');
  routes.forEach(function (route) {
    var file = path.join(base, route.script);
    if (!compiled[file]) {
      // **TODO**: Uncache to ensure evaluation?
      require(file);
      compiled[file] = registered.shift();
    }
    reactor.get(route.route, function (params, request, response) {
      var pathInfo = params.pathInfo ? '/' + params.pathInfo : '';
      try {
        compiled[file](request, response, function (error) {
          if (error) throw error;
        });
      } catch (e) {
        if (e instanceof Redirect) {
        } else if (e instanceof HTTPError) {
        } else {
          throw e;
        }
      }
    });
  });
  return function (request, response, next) {
    var uri = url.parse(request.url, true);
    if (!reactor.react(request.method, uri.pathname, request, response)) next();
  }
}
