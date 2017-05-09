var http = require('http');
var fs = require("fs");
var Twit = require('twit');
var tweeet;

var config = require('./config');
var T = new Twit(config);

var parameters = {
	q: '@realDonaldTrump',
	count: 5,
	result_type: 'popular'
}

T.get('search/tweets', parameters, gotData);

function gotData(err, data, response){
	var tweets = data.statuses;
	for(var i = 0; i < tweets.length; i++){
		console.log(tweets[i].text);
		tweeet = tweets[i].text;
	}
}

var server = http.createServer(function(request, response){
	fs.readFile("index.html", function(err,data){
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});
}).listen(8080);

var io = require("socket.io").listen(server);

io.sockets.on('connection', function(socket){
	console.log('Connected');

	// var stream = T.stream('statuses/filter', {track : '@realDonaldTrump'})
	// stream.on('tweet', function(tweet){
	// 	io.sockets.emit('stream',tweet.text);
	// 	console.log(tweet.text);
	// });
	io.sockets.emit('tweeet', tweeet);
});