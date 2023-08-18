const { ObjectId } = require("mongodb");
const { getDb } = require("../db");

const getAllProjects = async (req, res) => {
  const db = getDb();
  const userId = new ObjectId(req.user._id);
  try {
    const projects = await db.collection("projects").find({ userId }).toArray();

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
  const userId = new ObjectId(req.user._id);
  try {
    const result = await db
      .collection("projects")
      .insertOne({ name: projectName, userId: userId });
    const projectId = result.insertedId;
    res.json({ _id: projectId, name: projectName, todos: [], userId: userId });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el proyecto" });
  }
};

const deleteProject = async (req, res) => {
  const db = getDb();
  const projectId = req.params.id;
  const userId = new ObjectId(req.user._id);
  try {
    await db
      .collection("projects")
      .deleteOne({ _id: new ObjectId(projectId), userId });
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
  deleteProject,
};
