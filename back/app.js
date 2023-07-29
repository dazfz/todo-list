const express = require("express");
const cors = require("cors");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./todos.db"); // Se creará una base de datos en el archivo todos.db

const PORT = 3000;

// Middleware para permitir el análisis de datos JSON en las solicitudes
app.use(cors());
app.use(express.json());
// Crear la tabla para los proyectos y sus todos en la base de datos
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

// Ruta para obtener todos los proyectos desde la base de datos
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM projects", (err, projects) => {
        if (err) {
          reject(err);
        } else {
          resolve(projects);
        }
      });
    });

    // Para cada proyecto, obtener los todos asociados
    for (const project of projects) {
      const todos = await new Promise((resolve, reject) => {
        db.all(
          "SELECT * FROM todos WHERE projectId = ?",
          project.id,
          (err, todos) => {
            if (err) {
              reject(err);
            } else {
              resolve(todos);
            }
          }
        );
      });

      // Agregar los todos al proyecto
      project.todos = todos;
    }

    // Una vez que se han obtenido todos los todos y se han agregado a los proyectos,
    // enviar la respuesta con la lista completa de proyectos incluyendo sus todos
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los proyectos" });
  }
});

// Ruta para obtener todos los elementos de un proyecto específico desde la base de datos
app.get("/api/projects/:id/todos", (req, res) => {
  const projectId = req.params.id;
  db.all("SELECT * FROM todos WHERE projectId = ?", projectId, (err, todos) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al obtener los todos del proyecto" });
    } else {
      res.json(todos);
    }
  });
});

// Ruta para agregar un nuevo proyecto a la base de datos
app.post("/api/projects", (req, res) => {
  const projectName = req.body.name;
  db.run("INSERT INTO projects (name) VALUES (?)", projectName, function (err) {
    if (err) {
      res.status(500).json({ error: "Error al agregar el proyecto" });
    } else {
      const projectId = this.lastID;
      res.json({ id: projectId, name: projectName, todos: [] });
    }
  });
});

// Ruta para obtener un proyecto específico desde la base de datos
app.get("/api/projects/:id", (req, res) => {
  const projectId = req.params.id;
  db.get("SELECT * FROM projects WHERE id = ?", projectId, (err, project) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener el proyecto" });
    } else {
      if (project) {
        // Si se encuentra el proyecto, también obtén los todos asociados a él
        db.all(
          "SELECT * FROM todos WHERE projectId = ?",
          projectId,
          (err, todos) => {
            if (err) {
              res
                .status(500)
                .json({ error: "Error al obtener los todos del proyecto" });
            } else {
              project.todos = todos;
              res.json(project);
            }
          }
        );
      } else {
        res.status(404).json({ error: "Proyecto no encontrado" });
      }
    }
  });
});

// Ruta para eliminar un proyecto de la base de datos
app.delete("/api/projects/:id", (req, res) => {
  const projectId = req.params.id;
  db.run("DELETE FROM projects WHERE id = ?", projectId, (err) => {
    if (err) {
      res.status(500).json({ error: "Error al eliminar el proyecto" });
    } else {
      // También eliminamos los todos asociados al proyecto
      db.run("DELETE FROM todos WHERE projectId = ?", projectId, (err) => {
        if (err) {
          res
            .status(500)
            .json({ error: "Error al eliminar los todos del proyecto" });
        } else {
          res.json({ message: "Proyecto eliminado exitosamente" });
        }
      });
    }
  });
});

// Ruta para agregar un nuevo elemento a un proyecto en la base de datos
app.post("/api/projects/:id/todos", (req, res) => {
  const projectId = req.params.id;
  const newTodo = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    checked: req.body.checked || 0,
  };

  db.run(
    "INSERT INTO todos (projectId, title, description, dueDate, priority, checked) VALUES (?, ?, ?, ?, ?, ?)",
    [
      projectId,
      newTodo.title,
      newTodo.description,
      newTodo.dueDate,
      newTodo.priority,
      newTodo.checked,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Error al agregar el todo al proyecto" });
      } else {
        newTodo.id = this.lastID;
        res.json(newTodo);
      }
    }
  );
});

app.get("/api/projects/:projectId/todos/:id", (req, res) => {
  const projectId = req.params.projectId;
  const todoId = req.params.id;
  db.get(
    "SELECT * FROM todos WHERE id = ? AND projectId = ?",
    [todoId, projectId],
    (err, todo) => {
      if (err) {
        res.status(500).json({ error: "Error al obtener el todo" });
      } else {
        if (todo) {
          res.json(todo);
        } else {
          res.status(404).json({ error: "Todo no encontrado" });
        }
      }
    }
  );
});

app.put("/api/projects/:projectId/todos/:id", (req, res) => {
  const projectId = req.params.projectId;
  const todoId = req.params.id;
  const updatedTodo = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    checked: req.body.checked || 0,
  };

  db.run(
    "UPDATE todos SET title = ?, description = ?, dueDate = ?, priority = ?, checked = ? WHERE id = ? AND projectId = ?",
    [
      updatedTodo.title,
      updatedTodo.description,
      updatedTodo.dueDate,
      updatedTodo.priority,
      updatedTodo.checked,
      todoId,
      projectId,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Error al actualizar el todo" });
      } else {
        if (this.changes > 0) {
          res.json(updatedTodo);
        } else {
          res.status(404).json({ error: "Todo no encontrado" });
        }
      }
    }
  );
});

app.delete("/api/projects/:projectId/todos/:todoId", (req, res) => {
  const projectId = req.params.projectId;
  const todoId = req.params.todoId;
  db.run(
    "DELETE FROM todos WHERE id = ? AND projectId = ?",
    [todoId, projectId],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Error al eliminar el todo" });
      } else {
        res.json({ message: "Todo eliminado correctamente" });
      }
    }
  );
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
