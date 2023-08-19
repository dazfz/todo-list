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
export { createTodoBackend, updateTodoBackend, deleteTodoBackend };
