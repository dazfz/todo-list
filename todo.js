// Todo card, it exists in a project, contains, only essential info
import { openTodoForm } from "./form.js";
import { mod } from "./index.js";

const todoCard = (todo) => {
  const card = document.createElement("div");
  card.classList.add("card", "my-3");

  const date = document.createElement("p");
  date.classList.add(
    "card-header",
    "lead",
    "d-flex",
    "justify-content-between"
  );
  date.textContent = todo.dueDate
    ? `Expires: ${todo.dueDate}`
    : "No time limit";
  card.appendChild(date);

  const body = document.createElement("div");
  body.classList.add("card-body", "d-flex", "justify-content-between");

  const title = document.createElement("h3");
  title.textContent = todo.title;
  title.style.maxWidth = "85%";
  title.classList.add("card-title");
  title.classList.add("text-truncate");
  body.appendChild(title);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("form-check-input");
  checkbox.checked = todo.checked;
  checkbox.addEventListener(
    "change",
    (event) => (todo.checked = event.target.checked)
  );
  body.appendChild(checkbox);

  card.appendChild(body);
  return card;
};

// When the todo card is clicked, it will open the window with all the info
const todoWindow = (project, todo) => {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  const description = document.createElement("p");
  description.classList.add("mb-2");
  description.textContent = `Description: ${todo.description}`;
  popup.appendChild(description);

  const dueDate = document.createElement("p");
  dueDate.classList.add("mb-2");
  dueDate.textContent = `Due Date: ${todo.dueDate}`;
  popup.appendChild(dueDate);

  const priority = document.createElement("p");
  priority.classList.add("mb-4");
  priority.textContent = `Priority: ${todo.priority}`;
  popup.appendChild(priority);

  const editButton = document.createElement("button");
  editButton.innerHTML = 'Edit <i class="bi bi-pencil-square"></i>';
  editButton.classList.add("btn", "btn-primary");
  editButton.addEventListener("click", () => {
    openTodoForm(project, todo);
  });
  popup.appendChild(editButton);

  const title = mod.querySelector(".modal-title");
  title.textContent = todo.title;
  title.style.overflow = "auto";
  const body = mod.querySelector(".modal-body");
  body.append(popup);
};

export { todoCard, todoWindow };
