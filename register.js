var cadence = require('cadence');

exports.createServer = function (port, probe, callback) {
  var http = require('http'), server = http.createServer();

  server.on('error', function (e) {
    if (!probe || e.code != "EADDRINUSE") callback(e);
    else server.listen(++port, '127.0.0.1');
  });

  server.on('listening', function () {
    callback(null, server);
  });

  server.listen(port, '127.0.0.1');
}

exports.argParser = function (path, args) {
  args = args.slice();
  var url = require('url'), parsed;
  if (/^\s*\//.test(args[0]) || /^[^=:]+:/.test(args[0])) {
    parsed = url.parse(args.shift(), true);
  } else {
    parsed = url.parse(path, true);
  }
  args.forEach(function (pair) {
    var $ = /^([^=])*(?:=(.*))$/.exec(pair);
    parsed.query[$[1]] = $[2];
  });
  delete parsed.search;
  return url.parse(url.format(parsed), true);
}

exports.routes = function routes (base) {
  var find = require('reactor/find'),
      path = require('path'),
      reactor = require('reactor').createReactor(),
      compiled = {},
      url = require('url');
  var routes = find(base, 'cgi.js');
  routes.forEach(function (route) {
    var file = path.join(base, route.script);
    compiled[file] = require(file);
    reactor.get(route.route, function (params, callback) {
      callback(null, compiled[file]);
    });
  });
  return function (request, response, callback) {
    var uri = url.parse(request.url, true),
        found = reactor.react(request.method, uri.pathname, function (error, script) {
      script({ request: request, response: response }, function (error) {
        if (error) callback(error);
        else callback(null, true);
      });
    });
    if (!found) callback(null, false);
  }
}

exports.once = cadence(function (step, cwd, path, args) {
  var url = require('url'), request = require('request');
  step(function () {
    exports.createServer(8386, true, step());
  }, function (server) {
    function close () { server.close() }

    var port = server.address().port;

    var routes = exports.routes(cwd);
    server.on('request', function (request, response) {
      routes(request, response, function () {});
    });

    var parsed = exports.argParser(path, args);
    parsed.protocol = 'http';
    parsed.hostname = '127.0.0.1'
    parsed.port = port;

    var response = request({ timeout: 1000, uri: url.format(parsed) });

    response.on('error', step.error());
    response.on('end', close);

    response.end();

    step(function () {
      response.on('response', step.event());
    }, function () {
      return response;
    });
  });
});
