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
