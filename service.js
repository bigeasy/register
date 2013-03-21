exports.create = function () {
  return function (request, response, next) {
    response.setHeader("Content-Type", "text/plain");
    response.end("Hello, World!\n");
  }
}
