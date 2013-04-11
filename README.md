# Register

A CGI-like router that serves JavaScript programs from a directory.

Get Register with NPM.

```
install npm register
```

Create a register script, give it a name like `params.cgi.js`.

```
require('register')(function (request, response) {
  response.setHeader('Content-Type', 'text/plain');
  response.end(JSON.stringify(request.url.query || {}) + '\n');
});
```

You can now run you script from the command line to debug it. You can run it
directly or run it through a debugger.

```
$ node params.cgi.js 'name=register&number=1'
Content-Type: text/plain

{"name":"register","number":1}
```

Testing your register scripts is simplified by a mock request wrapper. Here we
create at test that is a simple Node.js program, but you can use the mock
request wrapper in the test framework of your choice.

```
var deepEqual = require ('assert').deepEqual;
var request = require('register/request');

request('./hello.cgi.js', { name: 'register', number: 1 }, function (headers, body) {
  deepEqual(headers['Content-Type'], 'text/plain');
  deepEqual(JSON.parse(body), { name: 'register', number: 1 });
});

```

Register works with Sencha Connect to add Register scripts to your web service.
We can create a service using a directory and add it to a Sencha Connect app.

```javascript
var service = require('regsiter/service');
var connect = require('connect');

var app = connect()
      .use(service.create('./scripts'))
      .listen(8082);
```

Register uses the directory driven [Reactor](https://github.com/bigeasy/reactor)
router to generate the routes for your web application. It follows some
conventions that convert the path of a script in a directory tree to the url
path in your application.

Let's use this example directory.

```
./
  ./params.cgi.js
  ./index.cgi.js
  ./utility.js
  ./configuration.txt
  ./articles/index.cgi.js
  ./articles/edit_.cgi.js
```

Only the files ending with `.cgi.js` are considered for addition to the path by
the service. The file basename is used for the file path so that `params.cgi.js`
in the directory is requested by the url `http://localhost/params`.

If the file base name is `index` as in `index.cgi.js`, then that is the script
that is run when url matches the directory name. `index.cgi.js` is run for the
root url `http://localhost/`.

If the file base name ends with an underscore, the script will match a url path.
The `` ./articles/edit_.cgi.js `` will match `http://localhost/articles/edit`.
Additionally, it will also match any sub-paths, so it would also match

 * `http://localhost/edit/1`
 * `http://localhost/edit/how-to-use-register`
 * `http://localhost/edit/2005/02/14`

The path would be passed into script as a `pathInfo` property of the `request`
object.

This is all inspired by the good old days of creating web sites by letting them
sprawl out over a directory on your web server.

## Change Log

Changes for each release.

### Version 0.0.0

Mon Mar 25 18:44:29 UTC 2013

 * Serve a basic script from the file system though HTTP. #8. #7. #6. #5.
 * Run a script as a program. #4.
