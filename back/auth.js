const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const { getDb } = require("./db");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const db = getDb();
        const user = await db
          .collection("users")
          .findOne({ username: username });

        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(async function (id, done) {
    const db = getDb();
    try {
      const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};



