var http = require('http');

process.on('uncaughtException', function(err){
  console.error('err:', err); // This error is logged
});

http.createServer(function(req, res){
  console.log('Got a req!');
  // Oops! #fn doesn't exist!
  fn(req, function(data){ // `req` is hanging now because we didn't execute this.
    console.log('Sending response!');
    res.end(data);
  }); 
}).listen(8000);
console.log('Listening on 8000');