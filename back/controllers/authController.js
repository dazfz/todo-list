const passport = require("passport");
const bcrypt = require("bcryptjs");
const { getDb } = require("../db");

const handleAuth = async (req, res) => {
  const action = req.params.action;
  const db = getDb();
  if (action === "login") {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: "Error de servidor" });
      }
      if (!user) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Error de sesión" });
        }
        res.json(user);
      });
    })(req, res);
  } else if (action === "signup") {
    try {
      const { username, email, password } = req.body;

      const existingUser = await db.collection("users").findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        let errorMessage = "";
        if (
          existingUser.username === username &&
          existingUser.email === email
        ) {
          errorMessage = "Username and email are already in use";
        } else if (existingUser.username === username) {
          errorMessage = "Username is already in use";
        } else if (existingUser.email === email) {
          errorMessage = "Email is already in use";
        }
        return res.status(409).json({ success: false, error: errorMessage });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        username,
        email,
        password: hashedPassword,
      };

      const result = await db.collection("users").insertOne(newUser);

      if (result.insertedId) {
        res.json({ success: true, message: "Usuario registrado exitosamente" });
      } else {
        res
          .status(500)
          .json({ success: false, error: "Failed to create new account" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  } else if (action === "logout") {
    try {
      req.logout(function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al cerrar la sesión" });
        }
        res.json({ success: true });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al cerrar la sesión" });
    }
  } else {
    res.status(400).json({ message: "Invalid action" });
  }
};

module.exports = {
  handleAuth,
};
