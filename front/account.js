import { updateProfileInfo } from "./app.js";
import { getProjects, showAllProjects,nullCurrent } from "./projects.js";
import { fetchProjects } from "./apiProjects.js";
import { loginBE, signupBE, logoutBE } from "./apiAuth.js";
import { createSubmitBtn } from "./buttons.js";

const createInputField = (labelText, inputType, inputName) => {
  const label = document.createElement("label");
  label.classList.add("form-label", "form-control-lg");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.classList.add("form-control", "form-control-lg");
  input.type = inputType;
  input.name = inputName;
  input.required = true;

  label.appendChild(input);
  return label;
};

const createForm = (titleText, submitButtonText) => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const header = document.createElement("div");
  header.classList.add("project-header", "d-flex", "justify-content-center");
  const title = document.createElement("h2");
  title.textContent = titleText;
  title.style.maxWidth = "60%";
  title.classList.add("text-truncate");
  header.appendChild(title);

  const form = document.createElement("form");

  const userField = createInputField(
    submitButtonText === "Register" ? "Username:" : "User/Email:",
    "text",
    "username"
  );
  form.appendChild(userField);

  if (submitButtonText === "Register") {
    const emailField = createInputField("Email:", "email", "email");
    form.appendChild(emailField);
  }

  const pwField = createInputField("Password:", "password", "password");
  form.appendChild(pwField);

  if (submitButtonText === "Register") {
    const pwField2 = createInputField(
      "Confirm password:",
      "password",
      "confirmpw"
    );
    form.appendChild(pwField2);
  }

  const errorDiv = document.createElement("div");
  errorDiv.classList.add("text-danger", "mb-2");
  form.appendChild(errorDiv);

  const submitBtn = createSubmitBtn();
  submitBtn.textContent = submitButtonText;
  form.appendChild(submitBtn);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const userData = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    let res;
    if (submitButtonText === "Register") {
      userData.email = formData.get("email");
      const confirmpw = formData.get("confirmpw");

      if (userData.password !== confirmpw) {
        console.log(userData.password, confirmpw);
        errorDiv.textContent = "Error: Passwords don't match";
        return;
      } else res = await signupBE(userData);
      if (res.success) {
        alert(`User ${userData.username} successfully registered!`);
        login();
      } else {
        errorDiv.textContent = `Error: ${res.error}`;
      }
    } else {
      res = await loginBE(userData);
      if (res) {
        updateProfileInfo(res);
        const p = await fetchProjects();
        getProjects(p);
        showAllProjects(p);
      }
    }
  });

  main.appendChild(header);
  main.append(form);

  const additionalBtnsDiv = document.createElement("div");
  additionalBtnsDiv.classList.add("d-flex", "justify-content-center");

  const signUpBtn = document.createElement("button");
  signUpBtn.classList.add("btn", "btn-link", "mx-2");
  signUpBtn.textContent =
    submitButtonText === "Log in"
      ? "Don't have an account?"
      : "Have an account?";
  signUpBtn.addEventListener("click", () => {
    submitButtonText === "Log in" ? signup() : login();
  });

  const forgotPwBtn = document.createElement("button");
  forgotPwBtn.classList.add("btn", "btn-link", "mx-2");
  forgotPwBtn.textContent = "Forgot your password?";
  forgotPwBtn.addEventListener("click", () => {
    // Acciones para Forgot Password
  });

  additionalBtnsDiv.appendChild(signUpBtn);
  additionalBtnsDiv.appendChild(forgotPwBtn);
  main.appendChild(additionalBtnsDiv);

  // Botón "Log In as Guest" debajo de los botones centrados
  const guestBtn = document.createElement("button");
  guestBtn.classList.add("btn", "btn-link", "mx-auto", "d-block");
  guestBtn.textContent = "Continue as a guest";
  guestBtn.addEventListener("click", () => {
    // Acciones para Log In as Guest
  });

  main.appendChild(guestBtn);
};

const login = () => {
  createForm("Sign in", "Log in", () => {});
};

const signup = () => {
  createForm("Sign up", "Register", () => {});
};

const profile = (user) => {
  if (!user) {
    login();
    return;
  }
  const main = document.querySelector("main");
  main.innerHTML = "";

  const header = document.createElement("div");
  header.classList.add("project-header", "d-flex", "justify-content-center");
  const title = document.createElement("h2");
  title.textContent = user.username;
  title.style.maxWidth = "60%";
  title.classList.add("text-truncate");
  header.appendChild(title);
  main.appendChild(header);

  const profileInfo = document.createElement("div");
  profileInfo.classList.add("profile-info");

  const username = createInputField("Username", "text", "username");
  const email = createInputField("Email:", "email", "email");
  username.querySelector("input").disabled = true;
  email.querySelector("input").disabled = true;
  username.querySelector("input").value = user.username;
  email.querySelector("input").value = user.email;

  profileInfo.appendChild(username);
  profileInfo.appendChild(email);
  const passwordBtn = document.createElement("button");
  passwordBtn.textContent = "Change password";
  passwordBtn.classList.add("btn", "btn-primary", "mx-2");
  passwordBtn.addEventListener("click", () => {
    // Acciones para cambiar la contraseña
  });
  profileInfo.appendChild(passwordBtn);

  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Log out";
  logoutBtn.classList.add("btn", "btn-primary");
  logoutBtn.addEventListener("click", async () => {
    const res = await logoutBE();
    if (res) {
      updateProfileInfo(null);
      getProjects(null);
      nullCurrent();
      login();
    }
  });

  profileInfo.appendChild(logoutBtn);
  main.appendChild(profileInfo);
};
export { profile };
