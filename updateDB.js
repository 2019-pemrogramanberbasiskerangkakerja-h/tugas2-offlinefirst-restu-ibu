//Requiring the package
var PouchDB = require('PouchDB');

//Creating the database object
var db = new PouchDB('my_database');

//Preparing the document for update
doc = {
   Name: 26,
   _rev: '3-552920d1ca372986fad7b996ce365f5d',
   }

//Inserting Document
db.put(doc);

//Reading the contents of a Document
db.get('001', function(err, doc) {
   if (err) {
      return console.log(err);
   } else {
      console.log(doc);
   }
});