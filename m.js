var x = require('express.io')
app = x();
console.log(app.route)

	app.route('ready', function(req){
		    req.io.join(req.data)
			        app.io.room(req.data).broadcast('announce', {
					        message: 'New client in the ' + req.data + ' room.'
							    })
	})

