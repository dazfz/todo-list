import { Project } from "./classes.js";
import { projectPage, projectCard } from "./project.js";
import { openProjectForm } from "./form.js";
import { createNewBtn } from "./buttons.js";
import modal from "./modal.js";

// window.addEventListener("beforeunload", function () {
//   localStorage.setItem("projects", JSON.stringify(projects));
// });
// window.addEventListener("unload", function () {
//   localStorage.setItem("projects", JSON.stringify(projects));
// });

// var projects = JSON.parse(localStorage.getItem("projects")) || [];

const BASE_URL = "http://localhost:3000"; // URL del servidor backend

async function fetchProjects() {
  try {
    const response = await fetch(`${BASE_URL}/api/projects`);
    if (!response.ok) {
      throw new Error("No se pudo obtener la lista de proyectos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error.message);
    return []; // Retorna una lista vacía en caso de error
  }
}

// Función para crear un nuevo todo en el backend
async function createNewTodoOnBackend(newTodo, project) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/projects/${project.id}/todos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      }
    );
    if (!response.ok) {
      throw new Error("No se pudo crear el nuevo todo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

// Función para actualizar un todo en el backend
async function updateTodoOnBackend(todo, project) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/projects/${project.id}/todos/${todo.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      }
    );
    if (!response.ok) {
      throw new Error("No se pudo actualizar el todo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function deleteTodoOnBackend(projectId, todoId) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/projects/${projectId}/todos/${todoId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("No se pudo eliminar el todo");
    }
    return true;
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
}

// Función para agregar un nuevo proyecto al backend
async function createNewProjectOnBackend(newProject) {
  try {
    const response = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
    });
    if (!response.ok) {
      throw new Error("No se pudo crear el nuevo proyecto");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
// Función para eliminar un proyecto del backend
async function deleteProjectOnBackend(projectId) {
  try {
    const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("No se pudo eliminar el proyecto");
    }
    return true;
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
}
var projects = await fetchProjects();
if (projects.length === 0) {
  const project = new Project("My Project");
  console.log(project);
  const addedProject = await createNewProjectOnBackend(project);
  if (addedProject) {
    projects.push(addedProject);
  }
}
var current = projects[0];

// asignarle null a current para que go back no vaya a un project anterior borrado
// Todo: arreglar de otra forma
const nullCurrent = () => (current = null);
const goBackBtn = document.querySelector("#goBack");
goBackBtn.addEventListener("click", () =>
  current !== null ? projectPage(current) : ""
);

const showAllProjects = (projects) => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const projectList = document.createElement("ul");
  projectList.classList.add("list-group");
  projects.forEach((project) => {
    const card = projectCard(project);
    card.addEventListener("click", () => {
      current = project;
      projectPage(project);
    });
    projectList.appendChild(card);
  });
  main.appendChild(projectList);

  const addButton = createNewBtn();
  addButton.classList.add("new", "rounded-circle", "btn-lg");
  addButton.addEventListener("click", () => openProjectForm(projects));
  main.appendChild(addButton);
};

const showAllBtn = document.querySelector("#showAll");
showAllBtn.addEventListener("click", () => showAllProjects(projects));

const mod = modal();
mod.addEventListener("hidden.bs.modal", () => {
  const modalBody = document.querySelector(".modal-body");
  while (modalBody.firstChild) {
    modalBody.removeChild(modalBody.firstChild);
  }
});
document.body.appendChild(mod);
showAllProjects(projects);
//projectPage(projects[0]);

export {
  projects,
  showAllProjects,
  nullCurrent,
  mod,
  createNewTodoOnBackend,
  updateTodoOnBackend,
  createNewProjectOnBackend,
  deleteProjectOnBackend,
  BASE_URL,
  deleteTodoOnBackend,
};
