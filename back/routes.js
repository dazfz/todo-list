const express = require("express");
const db = require("./db");
const router = express.Router();

// Helper function to handle database queries
const query = (sql, params) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

// Route to get all projects and their associated todos
router.get("/projects", async (req, res) => {
  try {
    const projects = await query("SELECT * FROM projects");
    for (const project of projects) {
      const todos = await query(
        "SELECT * FROM todos WHERE projectId = ?",
        project.id
      );
      project.todos = todos;
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los proyectos" });
  }
});

// Route to add a new project to the database
router.post("/projects", (req, res) => {
  const projectName = req.body.name;
  db.run("INSERT INTO projects (name) VALUES (?)", projectName, function (err) {
    if (err) res.status(500).json({ error: "Error al agregar el proyecto" });
    else {
      const projectId = this.lastID;
      res.json({ id: projectId, name: projectName, todos: [] });
    }
  });
});

// Route to get a specific project from the database
router.get("/projects/:id", async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await query(
      "SELECT * FROM projects WHERE id = ?",
      projectId
    );
    if (project) {
      const todos = await query(
        "SELECT * FROM todos WHERE projectId = ?",
        projectId
      );
      project.todos = todos;
      res.json(project);
    } else res.status(404).json({ error: "Proyecto no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el proyecto" });
  }
});

// Route to delete a project from the database
router.delete("/projects/:id", async (req, res) => {
  const projectId = req.params.id;
  try {
    await query("DELETE FROM projects WHERE id = ?", projectId);
    await query("DELETE FROM todos WHERE projectId = ?", projectId);
    res.json({ message: "Proyecto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el proyecto" });
  }
});

// Route to get all todos of a specific project
router.get("/projects/:id/todos", (req, res) => {
  const projectId = req.params.id;
  db.all("SELECT * FROM todos WHERE projectId = ?", projectId, (err, todos) => {
    if (err) res.status(500).json({ error: "Error al obtener to-do's" });
    else res.json(todos);
  });
});

// Route to add a new todo item to a project in the database
router.post("/projects/:id/todos", (req, res) => {
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
      if (err) res.status(500).json({ error: "Error al agregar to-do" });
      else {
        newTodo.id = this.lastID;
        res.json(newTodo);
      }
    }
  );
});

// Route to get a specific todo from the database
router.get("/projects/:projectId/todos/:id", async (req, res) => {
  const projectId = req.params.projectId;
  const todoId = req.params.id;
  try {
    const todo = await query(
      "SELECT * FROM todos WHERE id = ? AND projectId = ?",
      [todoId, projectId]
    );
    if (todo) res.json(todo);
    else res.status(404).json({ error: "To-do no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el to-do" });
  }
});

// Route to update a specific todo in the database
router.put("/projects/:projectId/todos/:id", async (req, res) => {
  const projectId = req.params.projectId;
  const todoId = req.params.id;
  const updatedTodo = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    checked: req.body.checked || 0,
  };
  try {
    const result = await query(
      "UPDATE todos SET title = ?, description = ?, dueDate = ?, priority = ?, checked = ? WHERE id = ? AND projectId = ?",
      [
        updatedTodo.title,
        updatedTodo.description,
        updatedTodo.dueDate,
        updatedTodo.priority,
        updatedTodo.checked,
        todoId,
        projectId,
      ]
    );
    if (result) res.json(updatedTodo);
    else res.status(404).json({ error: "To-do no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el to-do" });
  }
});

// Route to delete a specific todo from the database
router.delete("/projects/:projectId/todos/:todoId", async (req, res) => {
  const projectId = req.params.projectId;
  const todoId = req.params.todoId;
  try {
    await query("DELETE FROM todos WHERE id = ? AND projectId = ?", [
      todoId,
      projectId,
    ]);
    res.json({ message: "To-do eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el to-do" });
  }
});

module.exports = router;
