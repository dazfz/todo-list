import { Project } from "./classes.js";
import { projectPage, projectCard } from "./project.js";
import { openProjectForm } from "./form.js";
import { createNewBtn } from "./buttons.js";
import modal from "./modal.js";

window.addEventListener("beforeunload", function () {
  localStorage.setItem("projects", JSON.stringify(projects));
});
window.addEventListener("unload", function () {
  localStorage.setItem("projects", JSON.stringify(projects));
});

var projects = JSON.parse(localStorage.getItem("projects")) || [];

if (projects.length === 0) {
  const project = new Project("My Project");
  projects.push(project);
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
  
  const projectList = document.createElement("div");
  projectList.classList.add("list");
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
  addButton.classList.add("new","rounded-circle","btn-lg");
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

projectPage(projects[0]);

export { projects, showAllProjects, nullCurrent,mod };
