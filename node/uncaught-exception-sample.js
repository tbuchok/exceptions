var http = require('http')
  , DELIBERATE_ERROR = 'Causing a deliberate error';

process.on('uncaughtException', function(err){
  console.log('Uncaught Exception:', err);
});

var apiRequest = function(delay, callback) {
  if (delay === '2.0') return throw new Error(DELIBERATE_ERROR);
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
};

var delays = [  '3.0' 
              , '2.0'
              , '1.0' // This will not occur but the process won't die.
             ];

delays.forEach(function(delay) { 
  apiRequest(delay, handleAPIRequest); 
});