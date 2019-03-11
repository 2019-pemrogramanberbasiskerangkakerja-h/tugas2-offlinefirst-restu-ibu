//Requiring the package
var PouchDB = require('PouchDB');

var localdb = 'sample_database';

var remotedb = 'http://localhost:5984/sample_database1';

//Replicating a local database to Remote
PouchDB.replicate(remotedb, localdb);
console.log("Database replicated successfully");