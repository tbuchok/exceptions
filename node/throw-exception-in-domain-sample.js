var cluster = require('cluster')
  , domain = require('domain');

if (cluster.isMaster) {
  console.log('This is the master process ... Forking ... ');
  var delays = ['3.0', '2.0', '1.0'];
  delays.forEach(function(delay) { 
    cluster.fork({ DELAY : delay });
  });
  cluster.on('disconnect', function() {
    console.error('Disconnecting child process');
  });
} else {
 
  var http = require('http')
    , DELIBERATE_ERROR = 'Causing a deliberate error';

  var apiRequest = function(delay, callback) {
    if (delay === '2.0') throw new Error(DELIBERATE_ERROR);
    console.log('Fetching: http://slowapi.com/delay/' + delay);
    var url = 'http://slowapi.com/delay/' + delay;
    http.get(url, function(res) {
      var data = [];
      res.on('data', function(chunk){ data.push(chunk) });
      res.on('end', function(){ callback(null, 'Delay ' + delay + ': ' + data.join('')) });
    });
  }

  var handleAPIRequest = function(err, data){
    if (err) console.log('Error:', err);
    else console.log(data);
    cluster.worker.disconnect(); // Disconnect at completion.
  };

  apiRequest(process.env.DELAY, handleAPIRequest); 
}