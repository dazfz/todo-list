import { Todo, Project } from "./classes.js";
import { showAllProjects } from "./projects.js";
import { mod } from "./app.js";
import {
  createTodoBackend,
  updateTodoBackend,
  createProjectBackend,
} from "./api.js";
import { projectPage } from "./project.js";
import { todoWindow } from "./todo.js";
import { createSubmitBtn } from "./buttons.js";

const openTodoForm = (project, todo) => {
  const form = document.createElement("form");

  const titleLbl = document.createElement("label");
  titleLbl.classList.add("form-label", "form-control-lg");
  titleLbl.textContent = "Title:";
  const titleInpt = document.createElement("input");
  titleInpt.classList.add("form-control", "form-control-lg");
  titleInpt.type = "text";
  titleInpt.value = todo ? todo.title : ""; // Populate with existing value if available
  titleLbl.appendChild(titleInpt);
  form.appendChild(titleLbl);

  const descLbl = document.createElement("label");
  descLbl.classList.add("form-label", "form-control-lg");
  descLbl.textContent = "Description:";
  const descInpt = document.createElement("textarea");
  descInpt.classList.add("form-control", "form-control-lg");
  descInpt.value = todo ? todo.description : ""; // Populate with existing value if available
  descLbl.appendChild(descInpt);
  form.appendChild(descLbl);

  const dueDateLbl = document.createElement("label");
  dueDateLbl.textContent = "Due Date:";
  dueDateLbl.classList.add("form-label", "form-control-lg");
  const dueDateInpt = document.createElement("input");
  dueDateInpt.classList.add("form-control", "form-control-lg");
  dueDateInpt.type = "date";
  dueDateInpt.value = todo ? todo.dueDate : ""; // Populate with existing value if available
  dueDateLbl.appendChild(dueDateInpt);
  form.appendChild(dueDateLbl);

  // Dropdown
  const priorityLbl = document.createElement("label");
  priorityLbl.classList.add("form-label", "form-control-lg");
  priorityLbl.textContent = "Priority:";
  const prioritySelect = document.createElement("select");
  prioritySelect.classList.add("form-select", "form-select-lg");

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

  const submitBtn = createSubmitBtn();
  submitBtn.textContent = todo ? "Update" : "Add"; // Change button text based on editing or creating
  form.appendChild(submitBtn);

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (todo) {
      todo.title = titleInpt.value;
      todo.description = descInpt.value;
      todo.dueDate = dueDateInpt.value;
      todo.priority = prioritySelect.value;
      await updateTodoBackend(todo, project._id);
      todoWindow(project, todo);
    } else {
      // Creating a new todo
      const newTodo = new Todo(
        titleInpt.value,
        descInpt.value,
        dueDateInpt.value,
        prioritySelect.value
      );
      const addedTodo = await createTodoBackend(newTodo, project._id);
      if (addedTodo) {
        console.log(addedTodo);
        project.todos.push(addedTodo);
      }
    }
    projectPage(project);
  });

  const title = mod.querySelector(".modal-title");
  title.textContent = todo ? todo.title : "New Todo";
  const body = mod.querySelector(".modal-body");
  body.append(form);
};

const openProjectForm = async (projects) => {
  const form = document.createElement("form");

  const titleLbl = document.createElement("label");
  titleLbl.classList.add("form-label", "form-control-lg");
  titleLbl.textContent = "Title:";
  const titleInpt = document.createElement("input");
  titleInpt.classList.add("form-control", "form-control-lg");
  titleInpt.type = "text";
  titleLbl.appendChild(titleInpt);
  form.appendChild(titleLbl);

  const submitBtn = createSubmitBtn();
  form.appendChild(submitBtn);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newProject = new Project(titleInpt.value);
    const addedProject = await createProjectBackend(newProject);
    if (addedProject) {
      console.log(addedProject);
      projects.push(addedProject);
      showAllProjects(projects);
    }
  });
  const title = mod.querySelector(".modal-title");
  title.textContent = "New Project";
  const body = mod.querySelector(".modal-body");
  body.append(form);
};

export { openTodoForm, openProjectForm };
