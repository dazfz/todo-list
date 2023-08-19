import { projects, showAllProjects, current } from "./projects.js";
import { projectPage } from "./project.js";
import { profile } from "./account.js";
import modal from "./modal.js";

const goBackBtn = document.querySelector("#goBack");
const showAllBtn = document.querySelector("#showAll");
const accBtn = document.querySelector("#account");
const mod = modal();
let currentUser = null;

// Evento para regresar a la página de proyecto actual o no hacer nada
goBackBtn.addEventListener("click", () =>
  current !== null ? projectPage(current) : ""
);

// Evento para mostrar todos los proyectos
showAllBtn.addEventListener("click", () => showAllProjects(projects));

const updateProfileInfo = (user) => {
  currentUser = user;
};
accBtn.addEventListener("click", () => profile(currentUser));

// Evento para limpiar el contenido del modal cuando se oculta
mod.addEventListener("hidden.bs.modal", () => {
  const modalBody = document.querySelector(".modal-body");
  while (modalBody.firstChild) {
    modalBody.removeChild(modalBody.firstChild);
  }
});

// Agregar el modal al cuerpo del documento
document.body.appendChild(mod);

profile(currentUser);

export { mod, updateProfileInfo };
