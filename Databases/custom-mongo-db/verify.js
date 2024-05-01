async function verify(email, callback) {
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
    const query = { email: email };

    await users.update(
      query,
      { $set: { email_verified: true } },
      function (err, result) {
        client.close();

        if (err) return callback(err);
        callback(null, result);
      }
    );
  });
}
