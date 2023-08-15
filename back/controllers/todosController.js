const { ObjectId } = require("mongodb");
const { getDb } = require("../db");

const getTodosByProjectId = async (req, res) => {
  const db = getDb();
  const projectId = req.params.id;

  try {
    const todos = await db
      .collection("todos")
      .find({ projectId: new ObjectId(projectId) })
      .toArray();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener to-do's" });
  }
};

const createTodo = async (req, res) => {
  const db = getDb();
  const projectId = req.params.id;
  const newTodo = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    checked: req.body.checked || 0,
    projectId: new ObjectId(projectId),
  };

  try {
    const result = await db.collection("todos").insertOne(newTodo);
    newTodo._id = result.insertedId;

    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar to-do" });
  }
};

const getTodoById = async (req, res) => {
  const db = getDb();
  const projectId = req.params.projectId;
  const todoId = req.params.id;

  try {
    const todo = await db.collection("todos").findOne({
      _id: new ObjectId(todoId),
      projectId: new ObjectId(projectId),
    });
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: "To-do no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el to-do" });
  }
};

const updateTodo = async (req, res) => {
  const db = getDb();
  const projectId = req.params.projectId;
  const todoId = req.params.id;
  const updatedTodo = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    checked: req.body.checked,
  };

  try {
    const result = await db
      .collection("todos")
      .updateOne(
        { _id: new ObjectId(todoId), projectId: new ObjectId(projectId) },
        { $set: updatedTodo }
      );
    if (result) {
      res.json(updatedTodo);
    } else {
      res.status(404).json({ error: "To-do no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el to-do" });
  }
};

const deleteTodo = async (req, res) => {
  const db = getDb();
  const projectId = req.params.projectId;
  const todoId = req.params.todoId;

  try {
    const result = await db.collection("todos").deleteOne({
      _id: new ObjectId(todoId),
      projectId: new ObjectId(projectId),
    });

    if (result.deletedCount > 0) {
      res.json({ message: "To-do eliminado correctamente" });
    } else {
      res.status(404).json({ error: "To-do no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el to-do" });
  }
};

module.exports = {
  getTodosByProjectId,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
};
