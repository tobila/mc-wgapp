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
var passwordHash = require('password-hash');

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
			if (err) throw err;
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
	path: '/user/{username}',
	handler: function(request, reply){
		var username = encodeURIComponent(request.params.username);
		pool.getConnection(function(err, conn){
			conn.query("SELECT * FROM users WHERE username='"+username+"'", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'PUT',
	path: '/addUser',
	handler: function(request, reply){
		var username = request.payload.username;
		var password = request.payload.password;
		var hashedPassword = passwordHash.generate(password);
		pool.getConnection(function(err, conn){
			conn.query("INSERT INTO users (username, password) VALUES ('"+username+"', '"+hashedPassword+"')", function(error, result, fields){
				if(error) throw error;
				else reply("true");
				conn.release();
			});
		});
	}
});
server.route({
	method: 'DELETE',
	path: '/deleteUser/{username}',
	handler: function(request, reply){
		var username = username;
		pool.getConnection(function(err, conn){
			conn.query("DELETE FROM users WHERE username='"+username+"'", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'POST',
	path: '/verifyUser',
	handler: function(request, reply){
		var username = request.payload.username;
		var password = request.payload.password;
		pool.getConnection(function(err, conn){
			conn.query("SELECT password FROM users WHERE username='"+username+"'", function(error, result, fields){
				if(error) throw error;

				if(passwordHash.verify(password, result[0].password)){
					reply("true");
				}else{
					// reply("false "+JSON.stringify(result));
					reply("false");
				}
				conn.release();
			});
		});
	}
});




server.route({
	method: 'GET',
	path: '/investments',
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
	path: '/investment/{id}',
	handler: function(request, reply){
		var id = encodeURIComponent(request.params.id);
		pool.getConnection(function(err, conn){
			conn.query("SELECT * FROM investment WHERE id='"+id+"'", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'PUT',
	path: '/addInvestment',
	handler: function(request, reply){
		var reason = request.payload.reason;
		var amount = request.payload.amount;
		var user = request.payload.user;
		pool.getConnection(function(err, conn){
			conn.query("INSERT INTO investment (reason, amount, user) VALUES ('"+reason+"', '"+amount+"', '"+user+"')", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'DELETE',
	path: '/deleteInvestment/{id}',
	handler: function(request, reply){
		var id = encodeURIComponent(request.params.id);
		pool.getConnection(function(err, conn){
			conn.query("DELETE FROM investment WHERE id='"+id+"'", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'GET',
	path: '/investmentsForUsers',
	handler: function(request, reply){
		pool.getConnection(function(err, conn){
			conn.query("SELECT user, sum(amount) FROM investment group by user", function(error, result, fields){
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
	path: '/pantry/{articleName}',
	handler: function(request, reply){
		var articleName = encodeURIComponent(request.params.articleName);
		pool.getConnection(function(err, conn){
			conn.query("SELECT * FROM pantry WHERE articleName='"+articleName+"'", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'PUT',
	path: '/addArticleToPantry',
	handler: function(request, reply){
		var articleName = request.payload.articleName;
		var quantity = request.payload.quantity;
		var type = request.payload.type;
		var minQuantity = request.payload.minQuantity;
		var category = request.payload.category;
		pool.getConnection(function(err, conn){
			conn.query("INSERT INTO pantry (articleName, quantity, type, minQuantity, category) VALUES ('"+articleName+"', '"+quantity+"', '"+type+"', '"+minQuantity+"', '"+category+"')", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'DELETE',
	path: '/deleteArticleFromPantry/{articleName}',
	handler: function(request, reply){
		var articleName = encodeURIComponent(request.params.articleName);
		pool.getConnection(function(err, conn){
			conn.query("DELETE FROM pantry WHERE articleName='"+articleName+"'", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'POST',
	path: '/changeQuantityInPantry',
	handler: function(request, reply){
		var articleName = request.payload.articleName;
		var quantity = request.payload.quantity;
		pool.getConnection(function(err, conn){
			conn.query("UPDATE pantry SET quantity="+quantity+" WHERE articleName='"+articleName+"'", function(error, result, fields){
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
server.route({
	method: 'GET',
	path: '/shoppinglist/{articleName}',
	handler: function(request, reply){
		var articleName = encodeURIComponent(request.params.articleName);
		pool.getConnection(function(err, conn){
			conn.query("SELECT * FROM shoppinglist WHERE articleName='"+articleName+"'", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'PUT',
	path: '/addArticleToShoppinglist',
	handler: function(request, reply){
		var articleName = request.payload.articleName;
		var quantity = request.payload.quantity;
		var type = request.payload.type;
		pool.getConnection(function(err, conn){
			conn.query("INSERT INTO shoppinglist (articleName, quantity, type) VALUES ('"+articleName+"', '"+quantity+"', '"+type+"')", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'DELETE',
	path: '/deleteArticleFromShoppinglist/{articleName}',
	handler: function(request, reply){
		var articleName = encodeURIComponent(request.params.articleName);
		pool.getConnection(function(err, conn){
			conn.query("DELETE FROM shoppinglist WHERE articleName='"+articleName+"'", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
server.route({
	method: 'POST',
	path: '/changeQuantityInShoppinglist',
	handler: function(request, reply){
		var articleName = request.payload.articleName;
		var quantity = request.payload.quantity;
		pool.getConnection(function(err, conn){
			conn.query("UPDATE shoppinglist SET quantity="+quantity+" WHERE articleName='"+articleName+"'", function(error, result, fields){
				if(error) throw error;
				reply(result);
				conn.release();
			});
		});
	}
});
