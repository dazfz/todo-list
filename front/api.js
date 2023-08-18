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

async function createTodoBackend(newTodo, projectId) {
  try {
    const response = await fetch(`/api/projects/${projectId}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });
    if (!response.ok) throw new Error("No se pudo crear el nuevo todo");
    return await response.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function updateTodoBackend(todo, projectId) {
  try {
    const response = await fetch(
      `/api/projects/${projectId}/todos/${todo._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      }
    );
    if (!response.ok) throw new Error("No se pudo actualizar el todo");
    return await response.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function deleteTodoBackend(todoId, projectId) {
  try {
    const response = await fetch(`/api/projects/${projectId}/todos/${todoId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("No se pudo eliminar el todo");
    return true;
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
}

async function loginBE(userData) {
  const { username, password } = userData;
  try {
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    console.log(result);
    if (result.error) return null;
    return result;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function signupBE(userData) {
  const { username, email, password } = userData;

  try {
    const response = await fetch(`/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function logoutBE() {
  try {
    const response = await fetch(`/api/auth/logout`, {
      method: "POST",
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error("No se pudo cerrar la sesión");
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export {
  fetchProjects,
  createProjectBackend,
  deleteProjectBackend,
  createTodoBackend,
  updateTodoBackend,
  deleteTodoBackend,
  loginBE,
  signupBE,
  logoutBE,
};
