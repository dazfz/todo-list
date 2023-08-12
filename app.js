import { projects, showAllProjects, current } from "./projects.js";
import { projectPage } from "./project.js";
import modal from "./modal.js";

const goBackBtn = document.querySelector("#goBack");
goBackBtn.addEventListener("click", () =>
  current !== null ? projectPage(current) : ""
);

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
export { mod };
