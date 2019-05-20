//Requiring the package
var PouchDB = require('PouchDB');

//Creating the database object
var localdb = new PouchDB('dbsync');
var remoteDB = new PouchDB('http://localhost:3333/my_database')

//Creating doc for testing
docgates = {
   _id : 'gates1',
   gates: 'gates1',
   role: 'bond',
   time_start: '06:00:00' ,
   time_end: '12:00:00'
   }

   docgates2 = {
   _id : 'gates2',
   gates: 'gates2',
   role: 'james',
   time_start: '01:00:00' ,
   time_end: '05:00:00'
   }

// doc2 = {
//    _id : '046',
//    username: 'redo',
//    password: 'ganteng'
//    }
//Inserting Document
localdb.put(docgates2, function(err, response) {
   if (err) {
      return console.log(err);
   } else {
      console.log("Document created Successfully");
   }
});

// localdb.put(doc2, function(err, response) {
//    if (err) {
//       return console.log(err);
//    } else {
//       console.log("Document 2 created Successfully");
//    }
// });