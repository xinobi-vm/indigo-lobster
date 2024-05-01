function login(email, password, callback) {
  const bcrypt = require("bcrypt");
  const MongoClient = require("mongodb").MongoClient;
  const uri =
    "mongodb+srv://daruma:" +
    configuration.MONGO_PASS +
    "@cluster0.mdmhajt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db("cic-demo");
    const users = db.collection("users");

    users.findOne({ email: email }, function (err, user) {
      if (err || !user) {
        client.close();
        return callback(err || new WrongUsernameOrPasswordError(email));
      }

      bcrypt.compare(password, user.password, function (err, isValid) {
        client.close();

        if (err || !isValid)
          return callback(err || new WrongUsernameOrPasswordError(email));

        return callback(null, {
          user_id: user._id.toString(),
          nickname: user.nickname,
          email: user.email,
        });
      });
    });
  });
}
