#!/usr/bin/env node

/*

  ___ usage: en_US ___
  usage: register <options> [path?name=value] [name=value] [name=value]

  options:

    -P,   --pre                     a separated path of directories to prepend
                                    to application directory.

  ___ strings ___

    path required:
      a path to a script or script directory is required

    path not found:
      cannot locate path: %s

  ___ usage ___

*/

function run (argv, stdin, stdout, stderr, callback) {
    var arguable = require('arguable'),
        runner = require('./register').runner,
        vargs = [].slice.call(arguments, 1)
    arguable.parse(__filename, argv, function (options) {
        runner(options, stdin, stdout, stderr, callback || options.fatal)
    })
}

if (module === require.main) {
    run(process.argv.slice(2), process.stdin, process.stdout, process.stderr)
} else {
    module.exports = run
}
