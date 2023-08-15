const { ObjectId } = require("mongodb");
const { getDb } = require("../db");

const getAllProjects = async (req, res) => {
  try {
    const db = getDb();
    const projects = await db.collection("projects").find().toArray();

    for (const project of projects) {
      const todos = await db
        .collection("todos")
        .find({ projectId: new ObjectId(project._id) })
        .toArray();
      project.todos = todos;
    }

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los proyectos" });
  }
};

const createProject = async (req, res) => {
  const db = getDb();
  const projectName = req.body.name;

  try {
    const result = await db
      .collection("projects")
      .insertOne({ name: projectName });
    const projectId = result.insertedId;

    res.json({ _id: projectId, name: projectName, todos: [] });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el proyecto" });
  }
};

const getProjectById = async (req, res) => {
  const db = getDb();
  const projectId = req.params.id;

  try {
    const project = await db
      .collection("projects")
      .findOne({ _id: new ObjectId(projectId) });

    if (project) {
      const todos = await db
        .collection("todos")
        .find({ projectId: new ObjectId(projectId) })
        .toArray();
      project.todos = todos;
      res.json(project);
    } else {
      res.status(404).json({ error: "Proyecto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el proyecto" });
  }
};

const deleteProject = async (req, res) => {
  const db = getDb();
  const projectId = req.params.id;

  try {
    await db.collection("projects").deleteOne({ _id: new ObjectId(projectId) });
    await db
      .collection("todos")
      .deleteMany({ projectId: new ObjectId(projectId) });

    res.json({ message: "Proyecto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el proyecto" });
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  deleteProject,
};
