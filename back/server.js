const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const { connectToDatabase } = require("./db");
const app = express();
const PORT = 3000;

// Conectar a la base de datos al inicio
connectToDatabase()
  .then(() => {
    // Middleware
    app.use(
      cors({
        origin: `http://localhost:${PORT}`, // Cambia esto a la URL de tu frontend
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "../front")));

    // Configurar autenticación y sesiones
    app.use(
      session({
        secret: "cats",
        resave: false,
        saveUninitialized: true,
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.urlencoded({ extended: false }));
    require("./auth")(passport);
    
    const routes = require("./routes");
    // Rutas de la API
    app.use("/api", routes);

    // Obtener el frontend
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../front/index.html"));
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
