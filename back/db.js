const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./todos.db"); // Se creará una base de datos en el archivo todos.db

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      priority INTEGER,
      checked INTEGER DEFAULT 0,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
