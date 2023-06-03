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
  deleteTodoBtn.innerHTML = 'Delete Project <i class="bi bi-trash"></i>';
  deleteTodoBtn.addEventListener("click", () => {
    const projectIndex = projects.indexOf(project);
    if (projectIndex !== -1) {
      projects.splice(projectIndex, 1);
      nullCurrent();
      showAllProjects(projects);
    }
  });
  header.appendChild(deleteTodoBtn);

  const newBtn = createNewBtn();
  newBtn.addEventListener("click", () => openTodoForm(project, null));
  header.appendChild(newBtn);

  const todoList = document.createElement("div");
  todoList.classList.add("list");

  project.todos.forEach((todo) => {
    const todoCardElement = todoCard(todo);

    const detailBtn = createNewBtn();
    detailBtn.innerHTML = '<i class="bi bi-zoom-in"></i>';
    detailBtn.addEventListener("click", () => {
      todoWindow(project, todo);
    });
    todoCardElement.appendChild(detailBtn);

    const deleteBtn = createDeleteBtn();
    deleteBtn.addEventListener("click", () => {
      event.stopPropagation(); // Stop the click event from propagating to the todoCardElement
      const todoIndex = project.todos.indexOf(todo);
      if (todoIndex !== -1) project.todos.splice(todoIndex, 1);

      todoList.removeChild(todoCardElement);
    });

    todoCardElement.appendChild(deleteBtn);
    todoList.appendChild(todoCardElement);
  });

  main.appendChild(header);
  main.appendChild(todoList);
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
