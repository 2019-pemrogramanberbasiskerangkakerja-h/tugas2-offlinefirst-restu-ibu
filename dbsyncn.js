var Express = require("express");
var bodyParser = require("body-parser");
var PouchDB = require("pouchdb");
var session = require('express-session');
var path = require('path');
//var popup = require ('popups');
PouchDB.plugin(require('pouchdb-find'));
var multer = require('multer');
var upload = multer(); 
var cookieParser = require('cookie-parser');
var stringify = require('json-stringify-safe');
//var MemoryStore = require('connect').session.MemoryStore;
var app = Express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vash');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	// store: new MemoryStore({ 
 //        reapInterval: 60000 * 10
 //    })
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(upload.array());
app.use(cookieParser());

var database = new PouchDB('dbsync');

// FUNCTION
const parseJSONAsync = (JSONString) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(JSONString))
    })
  })
}

function checkSignIn(req, res, next){
   if(req.session.user ){
      next();     //If session exists, proceed to page

   } else if (req.session.user == 'undefined'){
   	  var err = new Error("No User, please log in!");
      console.log(req.session.user);
      //next(err);  //Error, trying to access unauthorized page!
      res.redirect(400, '/login');


   } else {
      var err = new Error("Not logged in!, please log in!");
      console.log(req.session.user);
      //next(err);  //Error, trying to access unauthorized page!
      res.redirect(400, '/login');
   }
}

// page

app.get('/', checkSignIn, function(req, res) {
	res.render('home');
});

app.get('/login', function(req, res) {
	res.render('coba');
});

app.get('/addgates', function(req, res) {
	res.render('addgate');
});

app.get('/daftar', function(req, res) {
	res.render('daftar');
});



// ROUTES

// AUTH login
app.post('/login', function(req, res, next) {
	
	if(req.body){
		var getUsername = req.body.nrp;
		var getPassword = req.body.password;
		//var getRole = req.body.role;
		var getUserGates = req.body.gates;
	} else {
		var getUsername = req.params.id;
		var getPassword = req.params.password;
		//var getRole = req.body.role;
		var getUserGates = req.params.gates;

	}


	req.session.nrp = getUsername;
	req.session.pass = getPassword;
	req.session.gate = getUserGates;
	//console.log(getPassword + getUsername)

	var getTime = '10:00:00'

	checkUserPass = new Promise(function(resolve,reject){
		var result = database.find({ 
		selector: {nrp : getUsername,password : getPassword}})
		.then(function (result){
			if(result.docs.length>0)
			{
				req.session.user = getUsername.toString();
				resolve(1)
			}
			else
			{
				resolve(0)
			}
		});
	});

	checkUserRole = new Promise(function(resolve,reject){
		var result = database.get(getUsername, function(err, docUser) {
			  if (err) {
			    return console.log(err);
			  } else {
				    var stringified = JSON.parse(stringify(docUser));
					const parseJSON = JSON.stringify(stringified);
					const user = JSON.parse(parseJSON);
					//console.log(parseJSON);
				    var getRoleUser = stringified.role;
				    //var getUsernameUser = user.nrp;
					getRoleUser.toString();
					resolve(getRoleUser);
					//req.session.user = getRoleUser;
					//console.log(req.session.user);
			  }
			});
	});

	checkGateRole = new Promise(function(resolve,reject){
		var result = database.get(getUserGates, function(err, docQueryGates) {
		  if (err) {
		    return console.log(err);
		  } else {
			    var queryGates = JSON.parse(stringify(docQueryGates));
				const parseJSONQuery = JSON.stringify(queryGates);
				const user = JSON.parse(parseJSONQuery);
				//console.log(parseJSON);
			    var getRoleGate = queryGates.role;
			    getRoleGate.toString();
				resolve(getRoleGate);
		  }
		});
	});

	checkGateTimeStart = new Promise(function(resolve,reject){
		var result = database.get(getUserGates, function(err, docQueryGates) {
		  if (err) {
		    return console.log(err);
		  } else {
			    var queryGates = JSON.parse(stringify(docQueryGates));
				const parseJSONQuery = JSON.stringify(queryGates);
				const user = JSON.parse(parseJSONQuery);
				//console.log(parseJSON);
			    var getGateStart = queryGates.time_start;
			    getGateStart.toString();
				resolve(getGateStart);
		  }
		});
	})

	checkGateTimeEnd = new Promise(function(resolve,reject){
		var result = database.get(getUserGates, function(err, docQueryGates) {
		  if (err) {
		    return console.log(err);
		  } else {
			    var queryGates = JSON.parse(stringify(docQueryGates));
				const parseJSONQuery = JSON.stringify(queryGates);
				const user = JSON.parse(parseJSONQuery);
				//console.log(parseJSON);
			    var getGateEnd = queryGates.time_end;
			    getGateEnd.toString();
				resolve(getGateEnd);
		  }
		});
	})

	function loginProcess()
	{
		Promise.all([checkUserPass,checkUserRole,checkGateRole,checkGateTimeStart,checkGateTimeEnd]).then(function (result){
			console.log(result);
			if(result[0])
			{
				if(result[1] == result[2])
				{
					var dt = new Date();//current Date that gives us current Time also

					var startTime = result[3];
					var endTime = result[4];

					var s =  startTime.split(':');
					var dt1 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(),
					                   parseInt(s[0]), parseInt(s[1]), parseInt(s[2]));

					var e =  endTime.split(':');
					var dt2 = new Date(dt.getFullYear(), dt.getMonth(),
					                   dt.getDate(),parseInt(e[0]), parseInt(e[1]), parseInt(e[2]));

					var tetes = '10,00,00';
					var tetes2 = new Date(dt.getFullYear(), dt.getMonth(),
					                   dt.getDate(),parseInt(e[0]), parseInt(e[1]), parseInt(e[2]));

					if(dt >= dt1 && dt <= dt2)
					{
						console.log(req.session.user + ' Login Berhasil')
						res.redirect(200, '/home');
					}
					else
					{
						console.log('Login Gagal : Akses diluar waktu')
						res.redirect(400, '/login');
					}
				}
				else
				{
					console.log('Login Gagal : Role user tidak tersedia pada gate')
					res.redirect(400, '/login');
				}
				//Compare TIME then redirect
				//res.redirect(200, '/home');
			}
			else
			{
				console.log('Login Gagal : Username dan Password tidak ditemukan')
				res.redirect(400, '/login');
			}
		});
	}
	// function checkUserPass(user,pass){
	// 	var queryLogin = database.find({ 
	// 	selector: {nrp : getUsername,password : getPassword}})
	// 	.then(function (result){
	// 		if(result.docs.length>0)
	// 		{
	// 			return 1;
	// 		}
	// 		else
	// 		{
	// 			return res.status(400).send({
	// 		            "status": "error",
	// 		            "message": "User not found / password is incorrect"
	// 		        });
	// 		}
	// 	});
	// 	return queryLogin;
	// }

	if(getUsername && getPassword && getUserGates)
	{
		loginProcess();
	}

	// if (getUsername && getPassword) {
	// 	var loginPass = database.find({ 
	// 		selector: {nrp : getUsername,password : getPassword}})
	// 		.then(function (result) {
	// 		// list of people shown here
	// 		if(result.docs.length>0){
	// 			console.log('luaran');
	// 			req.session.user = getUsername.toString();
	// 			//res.redirect(200, '/home');
	// 			next();
	// 		}
	// 		else {
	// 			//res.send("User tidak ditemukan!");
	// 			//res.redirect(200, '/login', {message: "Invalid credentials!"});
	// 			return res.status(400).send({
	// 	            "status": "error",
	// 	            "message": "User not found / password is incorrect"
	// 	        });
	// 		}
	// 	}).then(function(QueryUser){
	// 		database.get(getUsername, function(err, docUser) {
	// 		  if (err) {
	// 		    return console.log(err);
	// 		  } else {
	// 			    var stringified = JSON.parse(stringify(docUser));
	// 				const parseJSON = JSON.stringify(stringified);
	// 				const user = JSON.parse(parseJSON);
	// 				//console.log(parseJSON);
	// 			    var getRoleUser = stringified.role;
	// 			    var getUsernameUser = user.nrp;
	// 				getRoleUser.toString();
	// 				//req.session.user = getRoleUser;
	// 				//console.log(req.session.user);
					
	// 				next();
	// 		  }
	// 		}).then(function(docGates){

	// 			database.get(getUserGates, function(err, docQueryGates) {
	// 			  if (err) {
	// 			    return console.log(err);
	// 			  } else {
	// 				    var queryGates = JSON.parse(stringify(docQueryGates));
	// 					const parseJSONQuery = JSON.stringify(queryGates);
	// 					const user = JSON.parse(parseJSONQuery);
	// 					//console.log(parseJSON);
	// 				    var getRoleUserquery = queryGates.role;
	// 				    var getTimeStart = queryGates.time_start;
	// 				    var getTimeEnd = queryGates.time_end;
	// 				    //var getUsernameUser = user.nrp;
	// 					//getRoleUser.toString();
	// 					//req.session.user = getRoleUserquery;
	// 					//console.log(req.session.user);


	// 					// get docs from above then
	// 					var stringified2 = JSON.parse(stringify(docGates));
	// 			 		var rolenyauser = stringified2.role;

	// 			 		if ( getRoleUserquery == rolenyauser){
	// 			 			console.log('compare berhasil')
	// 			 			//return res.status(200).send("sukses");
	// 			 			return 1
	// 			 		}
						
	// 					//next();
	// 			  }
	// 			})
			
	// 		});

			
	// 	});

	// 	console.log(loginPass)
		
	// } else {
	// 	res.send('Please enter Username and Password!');
	// 	res.end();
	// }
});

// User Home
app.get('/home', checkSignIn ,function(req, res, next) {
	//res.send('Welcome back, ' + req.session.user + '!');
	if (req.session.user && req.session.user != 'undefined' ) {
		console.log(req.session.user);
		res.send('Welcome back, ' + req.session.nrp + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});

// logout
app.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user" + req.session.user + "has been logged out.")
   });
   res.redirect('/');
});

// CRUD Users
app.get("/users", function(req, res) {
    database.allDocs({
        include_docs: true
    }).then(function(result) {
        res.send(result.rows.map(function(item) {
        	if(item.doc.nrp){
        		return item.doc;
        	}
            //return item.doc;
        }));
    }, function(error) {
        res.status(400).send(error);
    });
});
app.get("/users/:id", function(req, res) {
    if (!req.params.id) {
        return res.status(400).send({
            "status": "error",
            "message": "An `id` is required"
        });
    }
    database.get(req.params.id).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});
app.post("/users", function(req, res) {
    req.body._id = req.body.nrp;
    if (!req.body.nrp) {
        return res.status(400).send({
            "status": "error",
            "message": "A `nrp` is required"
        });
    } else if (!req.body.password) {
        return res.status(400).send({
            "status": "error",
            "message": "A `password` is required"
        });
    }
    database.post(req.body).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});

app.post("/users/:id/:role/:password", function(req, res) {
	req.params.nrp = req.params.id;
	req.params._id = req.params.nrp;
    if (!req.params.id) {
        return res.status(400).send({
            "status": "error",
            "message": "An `id` is required"
        });
    }
    
	database.post(req.params).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});

app.delete("/users", function(req, res) {
    if (!req.body.id) {
        return res.status(400).send({
            "status": "error",
            "message": "An `id` is required"
        });
    }
    database.get(req.body.id).then(function(result) {
        return database.remove(result);
    }).then(function(result) {
        res.send(result);
        console.log(result);
    }, function(error) {
        res.status(400).send(error);
    });
});

app.delete("/users/:id", function(req, res) {
	req.params.nrp = req.params.id;
	req.params._id = req.params.nrp;
    if (!req.params.nrp) {
        return res.status(400).send({
            "status": "error",
            "message": "An `id` is required"
        });
    }
    database.get(req.params).then(function(result) {
        return database.remove(result);
    }).then(function(result) {
        res.send(result);
        console.log(result);
    }, function(error) {
        res.status(400).send(error);
    });
});


// CRUD GATES
app.get("/gates", function(req, res) {
    database.allDocs({
        include_docs: true
    }).then(function(result) {
        res.send(result.rows.map(function(item) {
        	if(item.doc.gates){
        		return item.doc;
        	}
        }));
        
        // view map function definition
		
	    // first check if the doc has type and isHyperlink fields
	    if(result.gates) {
	        emit([result.gates,result.role, result.startTime, result.endTime], result);
	        
	    }

		// // query a view
		// database.view('/gates', function (err, res) {
		//     // loop through each row returned by the view
		//     res.forEach(function (row) {
		//         // print out to console it's name and isHyperlink flag
		//         console.log(row.gates);
		//         return row.gates;
		//     });
		// });
    	

    }, function(error) {
        res.status(400).send(error);
    });
});
app.get("/gates/:id", function(req, res) {
	req.params.gates = req.params.id;
	req.params._id = req.params.gates;
    if (!req.params.id) {
        return res.status(400).send({
            "status": "error",
            "message": "An `id` is required"
        });
    }
    database.get(req.params.id).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});
app.post("/gates", function(req, res) {
    req.body._id = req.body.gates;
    if (!req.body.gates) {
        return res.status(400).send({
            "status": "error",
            "message": "A `nrp` is required"
        });
    } else if (!req.body.role) {
        return res.status(400).send({
            "status": "error",
            "message": "A `password` is required"
        });
    }
    else if (!req.body.time_start) {
        return res.status(400).send({
            "status": "error",
            "message": "A `time start` is required"
        });
    }
    else if (!req.body.time_end) {
        return res.status(400).send({
            "status": "error",
            "message": "A `time end` is required"
        });
    }
    database.post(req.body).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});

app.post("/gates/:id/:role/:time_start/:time_end", function(req, res) {
	req.params.gates = req.params.id;
	req.params._id = req.params.gates;
    if (!req.params.id) {
        return res.status(400).send({
            "status": "error",
            "message": "An `id` is required"
        });
    }

	database.post(req.params).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});

app.delete("/gates", function(req, res) {
    if (!req.body.id) {
        return res.status(400).send({
            "status": "error",
            "message": "An `id` is required"
        });
    }
	console.log(req.body.id);
    database.get(req.body.id).then(function(result) {
        return database.remove(result);
    }).then(function(result) {
        res.send(result);
        console.log(result);
    }, function(error) {
        res.status(400).send(error);
    });
});

app.delete("/gates/:id", function(req, res) {
    if (!req.params.id) {
        return res.status(400).send({
            "status": "error",
            "message": "An `id` is required"
        });
    }
	console.log(req.params.id);
    database.get(req.params.id).then(function(result) {
        return database.remove(result);
    }).then(function(result) {
        res.send(result);
        console.log(result);
    }, function(error) {
        res.status(400).send(error);
    });
});



var server = app.listen(3000, function() {
    database.info().then(function(info) {
        console.log(info);
        console.log("Listening on port %s...", server.address().port);
    });
});
app.use('/static', Express.static('static'))
