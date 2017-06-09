/*eslint-env node*/

//------------------------------------------------------------------------------
// hello world app is based on node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
// var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

const Hapi = require('hapi');
const MySQL = require('mysql');

const server = new Hapi.Server();


var db_config = {
	connectionLimit: 10,
	host: 's61.goserver.host',
	user: 'web218_2',
	password: 'WG-APP',
	database: 'web218_db2'
};

var pool = MySQL.createPool(db_config);


if(process.env.VCAP_SERVICES){
  // running on bluemix

	// get the app environment from Cloud Foundry
	var appEnv = cfenv.getAppEnv();

	server.connection({
	    // host: appEnv.url,
	    port: appEnv.port
	});

	// create a new express server
	// var app = express();
	//
	// // serve the files out of ./public as our main files
	// app.use(express.static(__dirname + '/public'));
	//

	//
	// // start server on the specified port and binding host
	// app.listen(appEnv.port, '0.0.0.0', function() {
	//
	// 	// print a message when the server starts listening
	//   console.log("server starting on " + appEnv.url);
	// });
}else{
	// running locally

	server.connection({
	    port: 8000
	});


}

server.register([require('vision'), require('inert'), { register: require('lout') }], function(err) { });
// Start the server
server.start((err) => {

		if (err) {
				throw err;
		}
		console.log('Server running at:', server.info.uri);
});

// Routes
server.route({
	method: 'GET',
	path: '/users',
	handler: function(request, reply){
		pool.getConnection(function(err, conn){
			conn.query('SELECT * FROM user',
			function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});

server.route({
	method: 'GET',
	path: '/article',
	handler: function(request, reply){
		pool.getConnection(function(err, conn){
			conn.query('SELECT * FROM article',
			function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});

server.route({
	method: 'GET',
	path: '/articleInShoppinglist',
	handler: function(request, reply){
		pool.getConnection(function(err, conn){
			conn.query('SELECT * FROM articleInShoppinglist',
			function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});

server.route({
	method: 'GET',
	path: '/category',
	handler: function(request, reply){
		pool.getConnection(function(err, conn){
			conn.query('SELECT * FROM category',
			function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});

server.route({
	method: 'GET',
	path: '/investment',
	handler: function(request, reply){
		pool.getConnection(function(err, conn){
			conn.query('SELECT * FROM investment',
			function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});

server.route({
	method: 'GET',
	path: '/pantry',
	handler: function(request, reply){
		pool.getConnection(function(err, conn){
			conn.query('SELECT * FROM pantry',
			function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});

server.route({
	method: 'GET',
	path: '/shoppinglist',
	handler: function(request, reply){
		pool.getConnection(function(err, conn){
			conn.query('SELECT * FROM shoppinglist',
			function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
