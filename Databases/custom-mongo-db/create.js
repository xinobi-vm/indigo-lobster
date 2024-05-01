function create(user, callback) {
  const bcrypt = require("bcrypt");
  const MongoClient = require("mongodb").MongoClient;
  const uri =
    "mongodb+srv://daruma:" +
    configuration.MONGO_PASS +
    "@cluster0.mdmhajt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);
  console.log(`user: ${JSON.stringify(user.user_metadata, null, 4)}`);

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db("cic-demo");
    const users = db.collection("users");

    users.findOne({ email: user.email }, function (err, withSameMail) {
      if (err || withSameMail) {
        client.close();
        return callback(err || new Error("the user already exists"));
      }

      bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
          client.close();
          return callback(err);
        }

        user.password = hash;
        console.log(user.form);

        // User data from API
        if (user.user_metadata) {
          user.firstName = user.user_metadata["ulp-first-name"];
        }

        if (user.user_metadata) {
          user.lastName = user.user_metadata["ulp-last-name"];
        }

        if (user.user_metadata) {
          user.termsConsent = user.user_metadata["ulp-terms-of-service"];
          delete user["user_metadata"];
        }

        // User inputs data in the Form, then add that to the user's data
        if (user.form) {
          user.firstName = user.form["ulp-first-name"];
        }

        if (user.form) {
          user.lastName = user.form["ulp-last-name"];
        }

        if (user.form) {
          user.termsConsent = user.form["ulp-terms-of-service"];
        }

        users.insert(user, function (err, inserted) {
          client.close();

          if (err) return callback(err);
          callback(null);
        });
      });
    });
  });
}
