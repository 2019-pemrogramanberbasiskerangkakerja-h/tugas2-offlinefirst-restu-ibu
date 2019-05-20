// good promises and callback

// //Creating the database object 
// var db = new PouchDB('my_database');

// //Callback example 

// db.get('001', function(err, doc) {
//   if (err) {
//     return console.log(err);
//   } else {
//     var data = JSON.stringify(res)
//     return console.log(doc);
//   }
// });

// //Promise example

// var promise = db.get('001');
// promise.then(function(res) {
//   console.log(JSON.stringify(res));
// }).catch(function(err) {
//   console.log(JSON.stringify(err));
// });


// //Example to show advantages of promises

// db.put({
//   '_id': "001",
//   name: "newdoc"
// }).then(function(res) {
//   return db.get('001');
// }).then(function(res) {
//   console.log("Document was added and retrieved");
// }).catch(function(err) {
//   console.log(JSON.stringify(err));
// });



//Requiring the package
var PouchDB = require('PouchDB');
PouchDB.plugin(require('pouchdb-find'));


//Creating the database object
var db = new PouchDB('dbsync');

// //Reading the contents of a Document
// db.get('162', function(err, doc) {
//    if (err) {
//       return console.log(err);
//    } else {
// 		var love = db.find({
// 		  selector: {_id: {$gte: 'kukur'}},
// 		  sort: ['_id']
// 		});
//       console.log(doc);
//       //callback(love);
//    }
// });

// // read all db 
// db.allDocs({
//   include_docs: true,
//   attachments: true
 
// }).then(function (result) {
//   // handle result
//    // console.log(result);
//    db.get('314', function(err, doc) {
//    if (err) {
//       return console.log(err);
//    } else {
//    		var getUsername = 'kukur';
// 		var getPassword = 'kukur';
// 		var getRole = 'kukur';
// 		var getAccount = db.find({ 
// 			selector: {nrp : getUsername,password : getPassword, role : getRole}})
// 			.then(function (result) {
// 			// list of people shown here
// 			if(result.docs.length>0){
// 				//response.sendFile(path.join(__dirname + '/profile.html'));
// 			   	// request.session.user = nrp;
// 			   	// console.log(request.session.user);
// 			   	console.log('abis var get akun bawahe session.user atas' + '\n');
// 			   	console.log(getAccount.nrp);

				
// 			}
// 		});
//       console.log(doc);
//       //callback(love);
//    }
// });
// }).catch(function (err) {
//   console.log(err);
// });

// console.log('\n + \n');

// db.allDocs({
//   include_docs: true,
//   attachments: true
// }).then(function (result) {
// 	console.log('\n');
//   console.log(result);
//   //res.json({"nrp": result.rows});
// }).catch(function (err) {
//   console.log(err);
// });

// //Callback example 

db.get('001', function(err, doc) {
  if (err) {
    return console.log(err);
  } else {
    var data = JSON.stringify(res)
    return console.log(doc);
  }
});

//Promise example

// var promise = db.get('gates1');

// promise.then(function(res) {
//   console.log(JSON.stringify(res));
// }).catch(function(err) {
//   console.log(JSON.stringify(err));
// });


//Example to show advantages of promises

// db.put({
//   '_id': "redo",
//   nrp: "redonrp",
//   password: "redopassword"
// }).then(function(res) {
//   return db.get('redo');
// }).then(function(res) {
//   console.log("Document was added and retrieved");
// }).catch(function(err) {
//   console.log(JSON.stringify(err));
// });
