
var SerialPort = require('serialport');
var port = new SerialPort("COM19", {
	baudRate: 9600,
	parser: SerialPort.parsers.readline('\n')
});
var http = require('http');
var fs = require("fs");
var Twit = require('twit');
var tweeet;
var tweets;
var config = require('./config');
var T = new Twit(config);
var isPrinting = "N";


//Serial port opening and printing.
port.on('open', function(err){
		if(err){return console.log('Error on write: ', err.message);}
});
port.on('error', function(err){
	console.log('Error: ', err.message);
});
port.on('data', function(data){
	isPrinting = data;
	console.log(isPrinting);
});

//Twitter functions
var parameters = {
	screen_name: '@realDonaldTrump',
	count: 6
}

T.get('statuses/user_timeline', parameters, gotData);

function gotData(err, data, response){
	tweets = data;
	for(var i = 0; i < tweets.length; i++){
		tweeet = tweets[i].text;
		console.log(tweets[i].text);
	}
}

//Create server on port 8080
var server = http.createServer(function(request, response){
	fs.readFile("index.html", function(err,data){
		if(err)console.log(err);
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});

	if(request.method == 'POST'){
		var data = '';
		request.on('data',function(chunk){
			data+= chunk;
		});
		request.on('end', function(){
			serialPrint(data);
		});
	};
}).listen(8080);

//controls the Arduino
var serialPrint = function(data){
	console.log(isPrinting);
	if(isPrinting.trim() == "N"){
		if (data == "butt0=tweet0"){
			var message = JSON.stringify(tweets[0].text);
			message =  message + "\n";
			port.write(message);
			console.log(message);
		}
		if (data == "butt1=tweet1"){
			var message = JSON.stringify(tweets[1].text);
			message =  message + "\n";
			port.write(message);
			console.log(message);
		}
		if (data == "butt2=tweet2"){
			var message = JSON.stringify(tweets[2].text);
			message =  message + "\n";
			port.write(message);
			console.log(message);
		}
		if (data == "butt3=tweet3"){
			var message = JSON.stringify(tweets[3].text);
			message =  message + "\n";
			port.write(message);
			console.log(message);
		}
		if (data == "butt4=tweet4"){
			var message = JSON.stringify(tweets[4].text);
			message =  message + "\n";
			port.write(message);
			console.log(message);
		}
		if (data == "butt5=tweet5"){
			var message = JSON.stringify(tweets[5].text);
			message =  message + "\n";
			port.write(message);
			console.log(message);
		}
	}else{
		console.log("Currently printing, please wait");
	};
};

//Start the socket connection to the HTML page
var io = require("socket.io").listen(server);
io.sockets.on('connection', function(socket){
	console.log('Connected');
	for(var i = 0; i < tweets.length; i++){
		tweeet = tweets[i].text;
		io.sockets.emit('tweeet', {index: i, tweet: tweeet});
	}
	io.sockets.emit('printing_status', isPrinting);
	socket.on('print check', function(data){
		io.sockets.emit('printing_status', isPrinting);
		console.log(data)
	});
});
