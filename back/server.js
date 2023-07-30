const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes");
const path = require("path");

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../front")));
// API routes
app.use("/api", routes);
// GET front-end
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/index.html"));
});
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
