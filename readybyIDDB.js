//Requiring the package
var PouchDB = require('PouchDB');

//Creating the database object
var db = new PouchDB('indonesia');

//Reading the contents of a Document
db.get('987', function(err, doc) {
   if (err) {
      return console.log(err);
   } else {
      console.log(doc);
   }
});