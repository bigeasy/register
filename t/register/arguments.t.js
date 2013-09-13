require('proof')(5, function (step, deepEqual, ok) {
    var parser = require('../../register').argvParser
    deepEqual(parser('/base', './script.cgi.js', [ 'http://alan:password@www.foo.com:8080/hello?a=b#c' ]).url, {
        protocol: 'http:',
        slashes: true,
        auth: 'alan:password',
        host: 'www.foo.com:8080',
        port: '8080',
        hostname: 'www.foo.com',
        hash: '#c',
        search: '?a=b',
        query: { a: 'b' },
        pathname: '/hello',
        path: '/hello?a=b',
        href: 'http://alan:password@www.foo.com:8080/hello?a=b#c'
    }, 'full url')
    deepEqual(parser('/base', './script.cgi.js', [ ' /hello?a=b#c' ]).url, {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: '#c',
        search: '?a=b',
        query: { a: 'b' },
        pathname: '/hello',
        path: '/hello?a=b',
        href: '/hello?a=b#c'
    }, 'path url')
    deepEqual(parser('/base', './script.cgi.js', [ ' /hello?a=b#c', 'd=e f' ]).url, {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: '#c',
        search: '?a=b&d=e%20f',
        query: { a: 'b', d: 'e f' },
        pathname: '/hello',
        path: '/hello?a=b&d=e%20f',
        href: '/hello?a=b&d=e%20f#c'
    }, 'path and parameters')
    // todo: shouldn't the `./` be converted to `/`?
    // todo: this isn't right, but I don't believe I'll be invoking it this way.
    deepEqual(parser('/base', '/script.cgi.js', [ 'az=b', 'd=e f' ]).url, {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: null,
        search: '?az=b&d=e%20f',
        query: { az: 'b', d: 'e f' },
        pathname: 'script.cgi.js',
        path: 'script.cgi.js?az=b&d=e%20f',
        href: 'script.cgi.js?az=b&d=e%20f'
  }, 'script and parameters')
  deepEqual(parser('/base', 'project//script', []), {
        method: 'get',
        directory: '/base/project',
        url: {
            protocol: null,
            slashes: null,
            auth: null,
            host: null,
            port: null,
            hostname: null,
            hash: null,
            search: '',
            query: {},
            pathname: 'script',
            path: 'script',
            href: 'script'
        }
  }, 'root and request delimited')
})
