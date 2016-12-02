fs = require('fs')
options = {
    key: fs.readFileSync('ssl/privatekey.pem'),
    cert: fs.readFileSync('ssl/certificate.pem')
}

var express = require('express.io');
var app = express();
app.https(options).io()
var PORT = 3000;
console.log('server started on port ' + PORT);





// build realtime-web app

app.listen(443)





app.use('/assets', express.static(__dirname + '/public'))

app.get('/', function(req, res){
	res.render('index.ejs');
});

app.listen(PORT);

app.io.route('ready', function(req) {
	req.io.join(req.data.chat_room);
	req.io.join(req.data.signal_room);
	app.io.room(req.data).broadcast('announce', {
		message: 'New client in the ' + req.data + ' room.'
	})
})

app.io.route('send', function(req) {
    app.io.room(req.data.room).broadcast('message', {
        message: req.data.message,
		author: req.data.author
    });
})

app.io.route('signal', function(req) {
	//Note the use of req here for broadcasting so only the sender doesn't receive their own messages
	req.io.room(req.data.room).broadcast('signaling_message', {
        type: req.data.type,
		message: req.data.message
    });
})



