const express = require("express");
const router = express.Router();

// Controladores
const projectsController = require("./controllers/projectsController");
const todosController = require("./controllers/todosController");

router.get("/projects", projectsController.getAllProjects);
router.post("/projects", projectsController.createProject);
router.get("/projects/:id", projectsController.getProjectById);
router.delete("/projects/:id", projectsController.deleteProject);

router.get("/projects/:id/todos", todosController.getTodosByProjectId);
router.post("/projects/:id/todos", todosController.createTodo);
router.get("/projects/:projectId/todos/:id", todosController.getTodoById);
router.put("/projects/:projectId/todos/:id", todosController.updateTodo);
router.delete("/projects/:projectId/todos/:todoId", todosController.deleteTodo);

module.exports = router;
