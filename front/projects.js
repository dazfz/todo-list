import { fetchProjects, createProjectBackend } from "./api.js";
import { Project } from "./classes.js";
import { projectPage, projectCard } from "./project.js";
import { createNewBtn } from "./buttons.js";
import { openProjectForm } from "./form.js";

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

// asignarle null a current para que go back no vaya a un project anterior borrado
const nullCurrent = () => (current = null);

var projects = await fetchProjects();

if (projects.length === 0) {
  const project = new Project("My Project");
  const addedProject = await createProjectBackend(project);
  if (addedProject) projects.push(addedProject);
}
var current = projects[0];
export { projects, showAllProjects, current, nullCurrent };
