import { Todo, Project } from "./classes.js";
import { showAllProjects } from "./index.js";
import { projectPage } from "./project.js";
import { todoWindow } from "./todo.js";

const openTodoForm = (project, todo) => {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-button");
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(popup);
    projectPage(project);
  });
  popup.appendChild(closeBtn);

  const form = document.createElement("form");

  const titleLbl = document.createElement("label");
  titleLbl.textContent = "Title:";
  const titleInpt = document.createElement("input");
  titleInpt.type = "text";
  titleInpt.value = todo ? todo.title : ""; // Populate with existing value if available
  titleLbl.appendChild(titleInpt);
  form.appendChild(titleLbl);

  const descLbl = document.createElement("label");
  descLbl.textContent = "Description:";
  const descInpt = document.createElement("input");
  descInpt.type = "text";
  descInpt.value = todo ? todo.description : ""; // Populate with existing value if available
  descLbl.appendChild(descInpt);
  form.appendChild(descLbl);

  const dueDateLbl = document.createElement("label");
  dueDateLbl.textContent = "Due Date:";
  const dueDateInpt = document.createElement("input");
  dueDateInpt.type = "date";
  dueDateInpt.value = todo ? todo.dueDate : ""; // Populate with existing value if available
  dueDateLbl.appendChild(dueDateInpt);
  form.appendChild(dueDateLbl);

  const priorityLbl = document.createElement("label");
  priorityLbl.textContent = "Priority:";
  const prioritySelect = document.createElement("select");
  const lowOption = document.createElement("option");
  lowOption.value = "low";
  lowOption.textContent = "Low";
  const mediumOption = document.createElement("option");
  mediumOption.value = "medium";
  mediumOption.textContent = "Medium";
  const highOption = document.createElement("option");
  highOption.value = "high";
  highOption.textContent = "High";
  prioritySelect.appendChild(lowOption);
  prioritySelect.appendChild(mediumOption);
  prioritySelect.appendChild(highOption);
  prioritySelect.value = todo ? todo.priority : "low"; // Populate with existing value if available, default to "low" if not
  priorityLbl.appendChild(prioritySelect);
  form.appendChild(priorityLbl);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = todo ? "Update" : "Add"; // Change button text based on editing or creating
  submitBtn.classList.add("add");
  form.appendChild(submitBtn);

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (todo) {
      todo.title = titleInpt.value;
      todo.description = descInpt.value;
      todo.dueDate = dueDateInpt.value;
      todo.priority = prioritySelect.value;
      todoWindow(project, todo);
    } else {
      // Creating a new todo
      const newTodo = new Todo(
        titleInpt.value,
        descInpt.value,
        dueDateInpt.value,
        prioritySelect.value
      );
      project.todos.push(newTodo);
    }

    projectPage(project);

    document.body.removeChild(popup);
  });

  popup.append(form);
  document.body.append(popup);
};

const openProjectForm = (projects) => {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-button");
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => document.body.removeChild(popup));
  popup.appendChild(closeBtn);

  const form = document.createElement("form");

  const titleLbl = document.createElement("label");
  titleLbl.textContent = "Title:";
  const titleInpt = document.createElement("input");
  titleInpt.type = "text";
  titleLbl.appendChild(titleInpt);
  form.appendChild(titleLbl);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add";
  form.appendChild(submitBtn);

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProject = new Project(titleInpt.value);
    projects.push(newProject);
    showAllProjects(projects);
    document.body.removeChild(popup);
  });

  popup.append(form);
  document.body.append(popup);
};

export { openTodoForm, openProjectForm };
