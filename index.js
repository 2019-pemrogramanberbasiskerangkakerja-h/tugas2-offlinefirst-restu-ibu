var PouchDB = require('PouchDB');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
//var popup = require ('popups');
PouchDB.plugin(require('pouchdb-find'));
var multer = require('multer');
var upload = multer(); 
var cookieParser = require('cookie-parser');
var MemoryStore = require('connect').session.MemoryStore;



var localdb = new PouchDB('dbt4');
var remoteDB = new PouchDB('http://localhost:3333/my_datadase');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vash');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	store: new MemoryStore({ 
        reapInterval: 60000 * 10
    })
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(upload.array());
app.use(cookieParser());

// try {
// 	localdb.sync(remoteDB, {
// 		live: true,
// 		retry: true
// 	  }).on('change', function (change) {
// 		console.log('synchronization success');
// 	  }).on('paused', function (info) {
// 		console.log('synced paused, connection is lost. Either you are offline / the DB is could not be reached'); // replication was paused, usually because of a lost connection
// 	  	alert ('you reoffline, sync paused')
// 	  }).on('active', function (info) {
// 		console.log('synchronization resumed, DB will be synced now');// replication was resumed
// 	  }).on('error', function (err) {
// 		console.log('synchronization failed.');// totally unhandled error (shouldn't happen)
// 	  });

// }
// catch(error) {
// 	console.error(error)
// }



app.get('/getlocaldb', function(request, response) {
	localdb.getIndexes().then(function (result) {
  	// yo, a result
	}).catch(function (err) {
	  // ouch, an error
	});
});

app.get('/getremotedb', function(request, response) {
	remoteDB.getIndexes().then(function (result) {
  // yo, a result
	}).catch(function (err) {
	  // ouch, an error
	});
});

app.get('/', function(request, response) {
	//response.sendFile(path.join(__dirname + '/views/login.html'));
	response.render('login');
});

app.post('/daftar', function(request, response) {
	//id = leftPad(randomIntInc(1, 100), 3)
	id = Math.floor(Math.random()*(99999-100+1)+100);
	//id.toString();
	var getUsername = request.body.nrp;
	var getPassword = request.body.password;
	var getRole = request.body.role;
	//console.log(getPassword + getUsername)
	id += 1;
	//console.log(getUsername);
	if (getUsername && getPassword) {
		//inputUsername = 
		userRegister = {
		   _id : getUsername.toString(),
		   nrp: getUsername.toString(),
		   password: getPassword.toString(),
		   role : getRole.toString()
		   }
		//Inserting Document and adding to session
		request.session.user = userRegister;
		localdb.put(userRegister, function(err, response) {
		   if (err) {
		      	return console.log(err + "ini error gan masukin ke db nya");
		   } else {
		    	console.log("User " + getUsername + " created Successfully");
		    	//response.redirect('/protected_page');
		    	//response.end();
		   }
		});
		
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

function checkSignIn(request, response){
   if(request.session.user){
      next();     //If session exists, proceed to page
   } else {
      var err = new Error("Not logged in!");
      console.log(request.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}
app.get('/protected_page', checkSignIn, function(request, response){
   response.render('index', {nrp: request.session.user.nrp})
});

app.get('/masuk', function(request, response) {
	response.render('coba');
});

app.get('/daftar', function(request, response) {
	response.render('daftar');
});

app.post('/masuk', function(request, response) {
	
	var getUsername = request.body.nrp;
	var getPassword = request.body.password;
	var getRole = request.body.role;
	//console.log(getPassword + getUsername)
	if (getUsername && getPassword) {
		var getAccount = localdb.find({ 
			selector: {nrp : getUsername,password : getPassword, role : getRole}})
			.then(function (result) {
			// list of people shown here
			if(result.docs.length>0){
				//response.sendFile(path.join(__dirname + '/profile.html'));
			   	request.session.user = nrp;
			   	console.log(request.session.user);
			   	console.log('abis var get akun bawahe session.user atas');
			   	console.log(getAccount.nrp);
        		//// return all data wihout docs
    		 //    localdb.allDocs({include_docs: true}).then(function(result) {

			    //     response.send(result.rows.map(function(item) {
			    //   		console.log(item.doc);
			    //         return item.doc;
			    //     }));

			    // });
				// if(result.nrp && result.password) {
				//     var emitResult = emit(result.nrp);
				// }
				// console.log(emitResult);

				// if (result.nrp === getUsername && result.password === getPassword){
				// 	var emitUsername = 'Ivan Botol';
				// 	var emitPassword = emit(result.nrp);
				// 	console.log(emitUsername);
				// 	console.log(emitPassword);
				// }
				// console.log(emitUsername);

				localdb.query(function (docs, emit) {
				  emit(docs.nrp, docs.password);
				}, {key: getUsername, getPassword}).then(function (result) {
				  console.log('ada nrpnya gan');
				  request.session.user = getUsername;
				  console.log(request.session.user);
				}).catch(function (err) {
				  // handle any errors
				  console.log('query error')
				});
				getUsername.toString();
				console.log(request.session.user + "di getAccount " + "\n");
				response.redirect('/home', { message: "home credentials!"});
			}
			else {
				response.send("User tidak ditemukan!");
				response.redirect('/home', {message: "Invalid credentials!"});
			}
		});
		
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
			response.send('Welcome back, ' + message + '!');
	// if (request.session.user) {
	// 	console.log(request.session.user);
	// 	response.send('Welcome back, ' + getUsername + '!');
	// } else {
	// 	response.send('Please login to view this page!');
	// }
	// response.end();
});

app.get('/logout', function(request, response){
   request.session.destroy(function(){
      console.log("user" + request.session.user + "has been logged out.")
   });
   response.redirect('/');
});

app.listen(3000);
app.use('/static', express.static('static'))
