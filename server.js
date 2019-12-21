let express = require("express");
let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
let path = require("path");
app.use(express.static("public"));
const assert = require("assert");
// let documentDb;
// let db;
let mongodb = require("mongodb");
const uri =
  "mongodb+srv://node:node@cluster0-z8d22.mongodb.net/NodeDB?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true }
);
client.connect(err => {
  const db = client.db("NodeDB");
  const documentDb = db.collection("item");
  app.listen(8080);

  function isResultCallbackOK(error, result) {
    if (error != null) {
      return false;
    }
    return true;
  }

  let getAllItem = function(callBack) {
    db.collection("item")
      .find()
      .toArray(function(err, items) {
        callBack(items);
      });
  };
  let insertItem = function(item, callBack) {
    db.collection("item").insertOne(item, callBack);
  };
  let updateItem = function(item, callBack) {
    let filter = { _id: new mongodb.ObjectId(item._id) };
    let newValue = { $set: { name: item.name } };
    db.collection("item").updateOne(filter, newValue, callBack);
  };
  let deleteItem = function(item, resultApi) {
    let filter = { _id: new mongodb.ObjectId(item._id) };
    console.log(resultApi.isCallbackOK);

    db.collection("item").deleteOne(filter, function(error, result) {
      if (resultApi.isOK(error, result)) {
        resultApi.res.json({ error: false, message: "Success" });
      } else {
        resultApi.res.json({ error: true, message: "fail" });
      }
    });
  };

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });
  app.get("/items", function(req, res) {
    let allItem = getAllItem(function(items) {
      res.send(items);
    });
  });
  app.post("/updateitem", function(req, res) {
    let id = req.body.id;
    let updateValue = req.body.updateValue;
    updateItem({ _id: id, name: updateValue }, isResultCallbackOK);
  });
  app.post("/deleteitem", function(req, res) {
    let id = req.body.id;
    deleteItem({ _id: id }, { res: res, isOK: isResultCallbackOK });
  });
  app.post("/create-item", function(req, res) {
    insertItem({ name: req.body.item }, isResultCallbackOK);
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });
});
