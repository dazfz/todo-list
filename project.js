import { todoCard, todoWindow } from "./todo.js";
import { openTodoForm } from "./form.js";
import { projects, showAllProjects, nullCurrent } from "./index.js";
import { createNewBtn, createDeleteBtn } from "./buttons.js";

const projectPage = (project) => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const header = document.createElement("div");
  header.classList.add("project-header");

  const title = document.createElement("h2");
  title.textContent = project.name;
  header.appendChild(title);

  const deleteTodoBtn = createDeleteBtn();
  deleteTodoBtn.innerHTML = "Delete Project";
  deleteTodoBtn.addEventListener("click", () => {
    const projectIndex = projects.indexOf(project);
    if (projectIndex !== -1) {
      projects.splice(projectIndex, 1);
      nullCurrent();
      showAllProjects(projects);
    }
  });
  header.appendChild(deleteTodoBtn);

  const todoList = document.createElement("div");
  todoList.classList.add("list");

  project.todos.forEach((todo) => {
    const todoCardElement = todoCard(todo);

    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    const detailBtn = createNewBtn();
    detailBtn.classList.remove("btn-primary");
    detailBtn.classList.add("btn-outline-primary");
    detailBtn.innerHTML = '<i class="bi bi-info-circle-fill"></i>';
    detailBtn.addEventListener("click", () => {
      todoWindow(project, todo);
    });

    const editBtn = createNewBtn();
    editBtn.classList.remove("btn-primary");
    editBtn.classList.add("btn-outline-primary");
    editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
    editBtn.addEventListener("click", () => {
      openTodoForm(project, todo);
    });

    const deleteBtn = createDeleteBtn();
    deleteBtn.classList.remove("btn-danger");
    deleteBtn.classList.add("btn-outline-danger");
    deleteBtn.addEventListener("click", () => {
      event.stopPropagation(); // Stop the click event from propagating to the todoCardElement
      const todoIndex = project.todos.indexOf(todo);
      if (todoIndex !== -1) project.todos.splice(todoIndex, 1);

      todoList.removeChild(todoCardElement);
    });

    buttonGroup.appendChild(detailBtn);
    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(deleteBtn);
    buttonGroup.setAttribute("role", "group");
    todoCardElement.appendChild(buttonGroup);
    todoList.appendChild(todoCardElement);
  });

  const newBtn = createNewBtn();
  newBtn.classList.add("new","rounded-circle","btn-lg");
  newBtn.addEventListener("click", () => openTodoForm(project, null));

  main.appendChild(header);
  main.appendChild(todoList);
  main.appendChild(newBtn);
};

const projectCard = (project) => {
  const card = document.createElement("div");
  card.classList.add("card");

  const title = document.createElement("h2");
  title.textContent = project.name;
  card.appendChild(title);

  const todoCount = document.createElement("p");
  todoCount.textContent = `To-do's: ${project.todos.length}`;
  card.appendChild(todoCount);

  return card;
};

export { projectPage, projectCard };
