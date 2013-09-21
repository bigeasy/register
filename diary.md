# Register Design

About the name; I wanted to create something CGI like. Rather than fiddling with
a routing DSL, create a directory, the paths in which represent the paths in the
web application. Prefix an underbar if you don't want to serve a file, if it is
a relative include of some sort. Suffix and underbar if it is supposed to
capture path information, if it is supposed to match longer paths.

You're still able to 404 if something matches, you thrown an error.

You're able to redirect if something matches, of course, throw a redirect (not
so much an error, but errorish).

Then it is something like proof. Probably passing in the request object, parsed
through Connect middleware, and nothing terribly special there. There's an
opportunity to extract information from the `pathInfo`. You can run these
programs from the command line passing in your query string as an argument, or
you can pipe in a form post that you want to test.

Ah, the name. The name Register, because it is a synonym for directory, that's
how I found it, but I like that it as "gi" in the name, because for a time I was
searching for words that matched `^c.*gi`. Corgi popped to mind, but I don't
want to do a dog themed project, or if I ever do one, I only want to do one, not
any number of them. Register has gi in it, so when it gets put on the readme, it
ought to read...

Register is so name because it is CGI inspired, and Register has the sound of
CGI within it. Register is a synonym for directory, except for a slightly
different meaning of directory that the one we use in computing, but there are
enough bits and pieces here to help you remember why.

## SQL

Considering a Relatable based language.

```
SELECT *
  FROM employee
 WHERE lastName like = { '%' + ($.lastName || '')  }
 OFFSET { $.offset || 0 } LIMIT { Math.min($.limit || 10, 10) }
```

Then the values are all pulled from a context, and that context in the case a
query is the parsed query.

## A Little Too Easy

I keep waiting to hit a wall that requires me to stop and spend days on design,
but simply doing the next obvious thing seems to be working out for this
project.  Perhaps the notion of CGI-like is more than enough direction.

It is circumspect, this steady progress.

## Invocation

Started out using the Proof `require` pattern, but I'm going to switch to a
Cake-like pattern of global functions because it will be better, easier to
implement, but philosophically the individual scripts are not executables, like
Proof, they are not meant to stand on their own. It will be much easier to
implement, not requiring a custom require for web server use case.

## Scripts

Scripts are going to use some jQuery conventions, or one key one. If the script
returns false, it means we're not done. It can return false immediately or using
a callback.

This is Cadence. Cadence is why Register is ready for release already. There is
a lot of potential built into Cadence, it's logic, and the time I've spent
working with it with Proof, it adds up.

Thus, with Cadence, I can use a pipe to send a piped response and be done with
it, or I can use a sub-cadence to check a database and throw a redirect.

Either way.

## Inbox

Could be the case that `routify` belongs somewhere else? Probably, yes. Sadly,
that means finding a new name, which is going to be a real burden. `routify` is
available, but that was a working name that was meant to feel like it was
working, that I would want to replace.

Perhaps it belongs in `reactor`, since it can only work with `reactor`. I'll
move it there. The only name I can find so far, besides `delta`, which I'd like
to use for a difference algorithm, is going to be indirect. All it amounts to is
a find, really, and it creates patterns that are analogous to reactor patterns,
so I'd need to abstract it, then shim it back to what it is now, so it probably
does belong in `reactor`.

Or maybe I begin to do things like `reactor.directory`.

It could be the case that Reactor is the CGI serving thing, and Register is
simply an implementation of basic scripts. Maybe there is a shebang line or
equiv so that one pass through does it all, so there's some way to take a sip of
the file and see which handler will work with it.

Am I ignoring hidden files? dot files?

Yes, by virtue of only creating scripts with a `cgi.js` suffix. Thus, you can
put your cookie jar in the application directory. It will not get served.

## Concerns and Decisions

Do I add an `error`, `redirect` and `reroute` method to the response object or
do I create a new `register` object? I belive the latter, for now. The
`response` object is like a global namespace.

## Inbox

Testing execution, need to export the execute function, I believe, and use a
mock standard out and standard error.

What about streaming input? Do we always want to parse? Or do we want to only
parse if it is specified by the script?

Guessing MIME of inputs from testing; we can look for an initial `[` or `{`, but
how do you buffer in that way? You can slurp I guess.

Why not make this simple by making it difficult? Can the register program just
start an HTTP server for the duration of a command line invocation for the sake
of testing?

## Significant Change

Now that I can see that it would be easier to fire off the command line using a
runner, I'm not starting to want to move away from the too clever use of the
commad line. I'm going to build a runner anyway, so I might as well go ahead
and make it so that it will run one off scripts. If if do this, yes, what I had
was too clever by half, it's not important, this is not he most imporant work
that I'm doing.

## Reactor

Too complicated for Stencil and Register. Need only the file find and dispatch.

## Verbs

I surrender. Let's do verbs.

```
on.load(function (step) {
    step(function () {
        require('database').connect(step())
    }, function (connection) {
        this.connection = connection
    })
})

on.unload(function (step) {
    step(function () {
        this.connection.close(step())
    })
})

on.get(function (request) {
    fs.fileReadStream(request.url.path.substring(1)).pipe(request)
})

on.post(function (request) {
    request.pipe(fs.fileWriteStream(request.url.path.substring(1)))
})

on.delete(function (step, request) {
    step(function () {
        fs.unlink(request.url.path.substring(1), step())
    })
})
```

## Multiple Routes

Considering muliple routes, I'm imaginging --pre and --post and they are
additional directories where you can place register scripts. They all get run in
order. The first one to send headers stops processing, except. No, fine. The
first one to send headers or raise an error stops processing.

You can also use the properties of Avenue. Avenue will run scripts that match,
like `pathInfo` scripts, prior to running any scripts that are descendants.
Actually, I've not tested this yet, but it is a behavior I intend to support.

## Errors

Should errors be returned as JSON? I believe so. Currently I'm returning them as
plain text, but the caller is probably expecting JSON.

## Middleware

I'm going to make the most of Connect middleware. I'd like to add a means by
which to specify middleware to the script API. I imagine that there is default
middleware for body parsing and query parsing for all requests, but you can
either add or reset. Perhaps you specify middleware yourself using Register?

If so, then before I specify middleware, I need to sort out multiple routes.

Done, but I'm not going to get all the Sencha Middleware to work. Only the
middleware that will always call the `next` function. Stopping when headers are
sent is not working; not for static, which isn't going to send headers until it
invokes `stat` asynchornously.

I'd need to replace the `static` and `vhosts` middleware, but all the other
middleware works correctly. I'm not going to create a lot of fragile shims. If
it isn't a pass-through middleware, you can easily duplicate it with a Register
script anyway. In fact, I could just create a wrapper package.
