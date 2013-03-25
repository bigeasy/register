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
returns false, it means we're not done. It can return false immedately or using
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
