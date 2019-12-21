const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://node:node@cluster0-z8d22.mongodb.net/NodeDB?retryWrites=true&w=majority";

let _db;

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(
      url,
      { useUnifiedTopology: true },
      { useNewUrlParser: true },
      function(err, client) {
        _db = client.db("NodeDB");
        return callback(err);
      }
    );
  },
  /**
   * Returns the sum of a and b
   * @returns {Db}
   */
  getDb: function() {
    return _db;
  }
};
