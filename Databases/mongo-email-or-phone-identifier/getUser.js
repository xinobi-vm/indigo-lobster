async function getByEmail(email, callback) {
  const MongoClient = require("mongodb").MongoClient;
  const uri =
    "mongodb+srv://" +
    configuration.MONGO_USER +
    ":" +
    configuration.MONGO_PASSWORD +
    "@cluster0.mdmhajt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const dbName = "cic-phone-db";
  const collection = "users";
  const client = new MongoClient(uri);

  await client.connect(async function (err) {
    if (err) {
      return callback(err);
    }

    const db = client.db(dbName);
    const users = db.collection(collection);

    console.log(`Email/username variable: ${email}`);

    await users.findOne({ email: email }, function (err, user) {
      client.close();

      if (err) return callback(err);
      if (!user) return callback(null, null);

      console.log(`User: ${JSON.stringify(user, null, 2)}`);

      return callback(null, {
        user_id: user._id.toString(),
        nickname: user.nickname,
        email: user.email,
      });
    });
  });
}
