express = require('express.io')
app = express().http().io()
var port = 3000;
console.log("server start on port " + port)

app.get('/', function(req, res){
    res.render('index.ejs')
    console.log('server started on port 3000')
});

app.io.route('ready', function(req){
    req.io.join(req.data)
    app.io.room(req.data).broadcast('announce', {
        message: 'New client in the ' + req.data + ' room.'
    })
})

app.io.route('send', function(req) {
    app.io.room(req.data.room).broadcast('message', {
        message: req.data.message,
        author: req.data.author
    })
})
 
app.use('/assets', express.static(__dirname + '/public'));

app.listen(3000);
