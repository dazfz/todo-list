import { todoCard, todoWindow } from "./todo.js";
import { openTodoForm } from "./form.js";
import { projects, showAllProjects, nullCurrent } from "./projects.js";
import { deleteProjectBackend } from "./apiProjects.js";
import { deleteTodoBackend } from "./apiTodos.js";
import { createNewBtn, createDeleteBtn } from "./buttons.js";

const projectPage = (project) => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const header = document.createElement("div");
  header.classList.add("project-header", "d-flex", "justify-content-between");

  const title = document.createElement("h2");
  title.textContent = project.name;
  title.style.maxWidth = "60%";
  title.classList.add("text-truncate");
  header.appendChild(title);

  const deleteTodoBtn = document.createElement("button");
  deleteTodoBtn.innerHTML = "Delete Project";
  deleteTodoBtn.classList.add("btn", "btn-danger");
  deleteTodoBtn.addEventListener("click", async () => {
    const projectIndex = projects.indexOf(project);
    if (projectIndex !== -1) {
      const deleted = await deleteProjectBackend(project._id);
      if (deleted) {
        projects.splice(projectIndex, 1);
        nullCurrent();
        showAllProjects(projects);
      } else alert("No se pudo eliminar el proyecto.");
    }
  });
  header.appendChild(deleteTodoBtn);

  const todoList = document.createElement("div");

  project.todos.forEach((todo) => {
    const todoCardElement = todoCard(todo, project);

    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    const detailBtn = createNewBtn();
    detailBtn.classList.remove("btn-primary");
    detailBtn.classList.add("btn-outline-primary", "btn-sm");
    detailBtn.innerHTML = '<i class="bi bi-info-circle-fill"></i>';
    detailBtn.addEventListener("click", () => {
      todoWindow(project, todo);
    });

    const editBtn = createNewBtn();
    editBtn.classList.remove("btn-primary");
    editBtn.classList.add("btn-outline-primary", "btn-sm");
    editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
    editBtn.addEventListener("click", () => {
      openTodoForm(project, todo);
    });

    const deleteBtn = createDeleteBtn();
    deleteBtn.classList.remove("btn-danger");
    deleteBtn.classList.add("btn-outline-primary", "btn-sm");
    deleteBtn.addEventListener("click", async () => {
      event.stopPropagation(); // Stop the click event from propagating to the todoCardElement
      const todoIndex = project.todos.indexOf(todo);
      if (todoIndex !== -1) {
        const deleted = await deleteTodoBackend(todo._id, project._id);
        if (deleted) {
          project.todos.splice(todoIndex, 1);
          todoList.removeChild(todoCardElement);
        } else console.log("Error al eliminar to-do");
      }
    });

    buttonGroup.appendChild(detailBtn);
    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(deleteBtn);
    buttonGroup.setAttribute("role", "group");

    const date = todoCardElement.querySelector(".card-header");
    date.appendChild(buttonGroup);

    todoCardElement.insertBefore(date, todoCardElement.firstChild);
    todoList.appendChild(todoCardElement);
  });

  const newBtn = createNewBtn();
  newBtn.classList.add("new", "rounded-circle", "btn-lg");
  newBtn.addEventListener("click", () => openTodoForm(project, null));

  main.appendChild(header);
  main.appendChild(todoList);
  main.appendChild(newBtn);
};

const projectCard = (project) => {
  const card = document.createElement("li");
  card.classList.add("list-group-item");

  const title = document.createElement("h2");
  title.textContent = project.name;
  title.classList.add("text-truncate");
  card.appendChild(title);

  const todoCount = document.createElement("p");
  todoCount.textContent = `To-do's: ${project.todos.length}`;
  todoCount.classList.add("lead");
  card.appendChild(todoCount);

  return card;
};

export { projectPage, projectCard };
