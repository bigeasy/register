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
