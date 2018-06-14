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
    await MongoClient.connect(url, function(err, db) {
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
async function queryRecord (url,query,callback) {
  logger.info("inside query record");
  MongoClient.connect(url, function(err, db) {
    logger.info("inside mongo connect");
    if (err) throw err;
    var dbo = db.db("mydb");
    logger.info("inside mongo connect 1");
    dbo.collection("EmpDB").find(query).toArray(function(err, result) {
      logger.info("inside mongo connect2");
      if (err) throw err;
        callback(result);
        db.close();
    });
  });
  logger.info("out query record");
}

exports.insertRecord = insertRecord;
exports.queryRecord = queryRecord;
exports.queryRecord1 = queryRecord1;
