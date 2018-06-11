var MongoClient = require('mongodb').MongoClient;
var helper = require('./helper.js');
var logger = helper.getLogger('invoke-chaincode');
var url = "mongodb://localhost:27017/";

//Create db
// var url = "mongodb://localhost:27017/mydb";
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

//Create collection
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.createCollection("EmpDB", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

//Insert record
async function insertRecord (url,myobj) {
  logger.info("inside insert record");
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    // var myobj = { name: "Company Inc", address: "Highway 37" };
    console.log(myobj);
    dbo.collection("EmpDB").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

// Find one
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.collection("customers").findOne({}, function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
// });

//Query data
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   var query = { name: "Issac" };
//   dbo.collection("customers").find(query).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
// });

exports.insertRecord = insertRecord;
