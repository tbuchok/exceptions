# Exceptions and Threads

Experimentation regarding what happens when exceptions are thrown (or not thrown) in different threading environments.

## Why

When applications move to Production, keeping it alive is very important.

Running a stack that includes a both multi-threaded and single-threaded (or _psuedo_-single-threaded) can have some tricky nuances.

Do we catch uncaught exceptions? Do we allow the server to fallover? What are the the differences?

## How

This repo includes some example using trivial Ruby and Node.js examples. The Ruby code opens up some threads -- as a web server would -- and throws an exception. The ways we can handle this are interesting.

On the other hand, the Node.js examples show the value in passing an `err` value in callbacks -- rather than throwing exceptions. Finally, an example of why using `process.on('uncaughtException')` should be [view as very dangerous](http://nodejs.org/api/process.html#process_event_uncaughtexception).

## Contribute