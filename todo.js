// Todo card, it exists in a project, contains, only essential info
import { openTodoForm } from "./form.js";

const todoCard = (todo) => {
  const card = document.createElement("div");
  card.classList.add("card");

  const title = document.createElement("h3");
  title.textContent = todo.title;
  card.appendChild(title);

  const date = document.createElement("p");
  date.textContent = todo.dueDate;
  card.appendChild(date);

  const priority = document.createElement("p");
  priority.textContent = todo.priority;
  card.appendChild(priority);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.checked;
  checkbox.addEventListener(
    "change",
    (event) => (todo.checked = event.target.checked)
  );
  card.appendChild(checkbox);

  return card;
};

// When the todo card is clicked, it will open the window with all the info
const todoWindow = (project, todo) => {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-button");
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => document.body.removeChild(popup));
  popup.appendChild(closeBtn);

  const title = document.createElement("h3");
  title.textContent = todo.title;
  popup.appendChild(title);

  const description = document.createElement("p");
  description.textContent = `Description: ${todo.description}`;
  popup.appendChild(description);

  const dueDate = document.createElement("p");
  dueDate.textContent = `Due Date: ${todo.dueDate}`;
  popup.appendChild(dueDate);

  const priority = document.createElement("p");
  priority.textContent = `Priority: ${todo.priority}`;
  popup.appendChild(priority);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    openTodoForm(project, todo);
    document.body.removeChild(popup);
  });
  popup.appendChild(editButton);

  document.body.appendChild(popup);
};

export { todoCard, todoWindow };
