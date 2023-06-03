import { createCloseBtn } from "./buttons.js";

const modal = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.setAttribute("id", "modal");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-hidden", "true");

  const dialog = document.createElement("div");
  dialog.classList.add("modal-dialog", "modal-dialog-centered", "modal-dark");
  modal.appendChild(dialog);

  const content = document.createElement("div");
  content.classList.add("modal-content");
  dialog.appendChild(content);

  const header = document.createElement("div");
  header.classList.add("modal-header");
  content.appendChild(header);

  const title = document.createElement("h5");
  title.classList.add("modal-title");
  header.appendChild(title);

  const closeBtn = createCloseBtn();
  header.appendChild(closeBtn);

  const body = document.createElement("div");
  body.classList.add("modal-body");
  content.appendChild(body);

  return modal;
};

export default modal;
