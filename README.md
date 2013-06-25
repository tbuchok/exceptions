# Exceptions and Threads

Experimentation regarding what happens when exceptions are thrown (or not thrown) in different threading environments.

## Why

Running a stack that includes a both multi-threaded and single-threaded (or _psuedo_-single-threaded) can have some tricky nuances. Do we catch uncaught exceptions? Do we allow the server to fallover? What are the the differences?

## Examples


This repository contains a trivial example hitting [Slow API](http://slowapi.com) to demonstrate I/O happening simultaneously.

```bash
.
├── README.md
├── node
│   ├── catch-uncaught-exception-sample.js
│   ├── standard-sample.js
│   └── throw-exception-sample.js
└── ruby
    ├── abort_on_exception_sample.rb
    └── standard_sample.rb
```

### /ruby

This repo includes some example using trivial Ruby and Node.js examples. The Ruby code opens up some threads -- as a web server would -- and throws an exception. The ways we can handle this are interesting.

### /node

`$ node node/standard-sample.js` demonstrates the standard in Node.js: passing errors back through as the first argument of the callback.

```js
if (delay === '2.0') return callback(DELIBERATE_ERROR, null);
```

`$ node node/throw-exception-sample.js` does exactly what it sounds like -- the exception is thrown rather than passed as an argument to the callback.

```js
if (delay === '2.0') throw new Error(DELIBERATE_ERROR);
```

`$ node node/catch-uncaught-exception-sample.js` is the most peculiar of the bunch. Notice that the code now catches uncaught exceptions with 

```js
process.on('uncaughtException', function(err){
  console.log('Uncaught Exception:', err);
});
```

This effectively catches the thrown exception on Line 9 of the file. But notice that the first API request finishes -- the callbacks that had already been added to the stack continue, and anything afterwards are blown away. This trivial example demonstrates why using `process.on('uncaughtException', ...)` should be [viewed as very dangerous](http://nodejs.org/api/process.html#process_event_uncaughtexception).

## Contribute

Ask _Why?_! Challenge these ideas!

If you have another language or method of demonstrating exceptions -- please provide! Or better yet, illustrate something even further.

Pull requests welcome.