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
│   ├── standard-sample.js
│   ├── throw-exception-sample.js
│   └── uncaught-exception-sample.js
└── ruby
    ├── abort-on-exception-sample.rb
    └── standard-sample.rb
```

### /ruby

This repo includes some example using trivial Ruby and Node.js examples. The Ruby code opens up some threads -- as a web server would -- and throws an exception. The ways we can handle this are interesting.

### /node

_standard-sample.js_ demonstrates the standard in Node.js: passing errors back through as the first argument of the callback, in the style of 

```js
callback(err, ...args);
```



On the other hand, the Node.js examples show the value in passing an `err` value in callbacks -- rather than throwing exceptions. Finally, an example of why using `process.on('uncaughtException')` should be [view as very dangerous](http://nodejs.org/api/process.html#process_event_uncaughtexception).


## Contribute