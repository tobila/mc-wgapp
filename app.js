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

// console.log(process.argv[2]);

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
	    port: appEnv.port
	});

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
			conn.query('SELECT * FROM users', function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'GET',
	path: '/user/{userID}',
	handler: function(request, reply){
		var userID = encodeURIComponent(request.params.userID);
		pool.getConnection(function(err, conn){
			conn.query("SELECT * FROM users WHERE username='"+userID+"'", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'POST',
	path: '/user',
	handler: function(request, reply){
		var username = request.payload.username;
		var password = request.payload.password;
		pool.getConnection(function(err, conn){
			conn.query("INSERT INTO users (username, password) VALUES ('"+username+"', '"+password+"')", function(error, result, fields){
				if(error) throw error;
				// reply(name+" "+password);
				reply(result);
				conn.release();
			});
		});
	}
});

// server.route({
// 	method: 'GET',
// 	path: '/article',
// 	handler: function(request, reply){
// 		pool.getConnection(function(err, conn){
// 			conn.query('SELECT * FROM article', function(error, result, fields){
// 				if(error) throw error;
// 				reply(result);
// 				conn.release();
// 			});
// 		});
// 	}
// });

// server.route({
// 	method: 'GET',
// 	path: '/articleInShoppinglist',
// 	handler: function(request, reply){
// 		pool.getConnection(function(err, conn){
// 			conn.query('SELECT * FROM articleInShoppinglist', function(error, result, fields){
// 				if(error) throw error;
// 				reply(result);
// 				conn.release();
// 			});
// 		});
// 	}
// });

// server.route({
// 	method: 'GET',
// 	path: '/category',
// 	handler: function(request, reply){
// 		pool.getConnection(function(err, conn){
// 			conn.query('SELECT * FROM category', function(error, result, fields){
// 				if(error) throw error;
// 				reply(result);
// 				conn.release();
// 			});
// 		});
// 	}
// });

server.route({
	method: 'GET',
	path: '/investment',
	handler: function(request, reply){
		pool.getConnection(function(err, conn){
			conn.query('SELECT * FROM investment', function(error, result, fields){
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
			conn.query('SELECT * FROM pantry', function(error, result, fields){
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
			conn.query('SELECT * FROM shoppinglist', function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
