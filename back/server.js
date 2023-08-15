const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectToDatabase } = require("./db");
const app = express();
const routes = require("./routes");
const PORT = 3000;

// Conectar a la base de datos al inicio
connectToDatabase()
  .then(() => {
    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "../front")));

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
