const createCloseBtn = () => {
  const closeBtn = document.createElement("button");
  closeBtn.classList.add("btn-close", "float-end");
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.setAttribute("data-bs-dismiss", "modal");
  return closeBtn;
};

const createSubmitBtn = () => {
  const submitBtn = document.createElement("button");
  submitBtn.classList.add("btn", "btn-success","btn-lg");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add";
  submitBtn.setAttribute("data-bs-dismiss", "modal");
  return submitBtn;
};

const createNewBtn = () => {
  const newBtn = document.createElement("button");
  newBtn.innerHTML = "+";
  newBtn.classList.add("btn", "btn-primary");
  newBtn.setAttribute("data-bs-toggle", "modal");
  newBtn.setAttribute("data-bs-target", "#modal");
  return newBtn;
};

const createDeleteBtn = () => {
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
  deleteBtn.classList.add("btn", "btn-danger");
  return deleteBtn;
};

export { createCloseBtn, createSubmitBtn, createNewBtn, createDeleteBtn };
