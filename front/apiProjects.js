async function fetchProjects() {
  try {
    const response = await fetch(`/api/projects`, {
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("No se pudo obtener la lista de proyectos");
    return await response.json();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Función para agregar un nuevo proyecto al backend
async function createProjectBackend(newProject) {
  try {
    const response = await fetch(`/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
      credentials: "include",
    });
    if (!response.ok) throw new Error("No se pudo crear el nuevo proyecto");
    return await response.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function deleteProjectBackend(projectId) {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("No se pudo eliminar el proyecto");
    return true;
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
}

export { fetchProjects, createProjectBackend, deleteProjectBackend };
