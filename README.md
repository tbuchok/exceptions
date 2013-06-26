# Exceptions and Threads

Experimentation regarding what happens when exceptions are thrown (or not thrown) in different threading environments.

## TL;DR

If an exception is raised in an threaded application, that thread will fail -- but other threads will continue.

In a single-threaded environment, handling these errors is trickier.

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

`$ ruby ruby/standard_sample.rb` trivially shows us opening threads for each of the API requests. When the API request is for a duration of `2.0`, an exception is raised.

Please notice that the other threads complete their execution prior to the exception being raised. The other two threads execute properly, this is great and something enjoy (see more in the Node example).

`$ ruby ruby/abort_on_exception_sample.rb` aborts on the exception to "mimic" more closely the Node.js examples below -- notice how when we abort on exception, the entire process is aborted when a single thread raises an exception.

```ruby
Thread.abort_on_exception = true
```

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

Why? See how this leaks:

```bash
$ node node/leak.js
```

And in a separate process:

```bash
$ curl localhost:8000 # Request hangs
```

## Contribute

Ask _Why?_! Challenge these ideas!

If you have another language or method of demonstrating exceptions -- please provide! Or better yet, illustrate something even further.

Pull requests welcome.