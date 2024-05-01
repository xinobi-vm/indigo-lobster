async function changePassword(email, newPassword, callback) {
  const bcrypt = require("bcrypt");
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

    await bcrypt.hash(newPassword, 10, async function (err, hash) {
      if (err) {
        client.close();
        return callback(err);
      }

      await users.updateOne(
        { email: email },
        { $set: { password: hash } },
        function (err, result) {
          client.close();
          if (err) return callback(err);
          callback(null, result);
        }
      );
    });
  });
}
