async function remove(id, callback) {
  const MongoClient = require("mongodb").MongoClient;
  const uri =
    "mongodb+srv://daruma:" +
    configuration.MONGO_PASS +
    "@cluster0.mdmhajt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  await client.connect(async function (err) {
    if (err) return callback(err);

    const db = client.db("cic-demo");
    const users = db.collection("users");

    await users.findOne({ _id: id }, async function (err, user) {
      if (err) {
        return callback(err);
      }
      if (!user) {
        return callback(null, null);
      }

      await users.deleteOne({ email: user.email }, function (err) {
        client.close();

        if (err) return callback(err);
        callback(null);
      });
    });
  });
}
