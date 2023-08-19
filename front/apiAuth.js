async function loginBE(userData) {
  const { username, password } = userData;
  try {
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    console.log(result);
    if (result.error) return null;
    return result;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function signupBE(userData) {
  const { username, email, password } = userData;

  try {
    const response = await fetch(`/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function logoutBE() {
  try {
    const response = await fetch(`/api/auth/logout`, {
      method: "POST",
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error("No se pudo cerrar la sesión");
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
export { loginBE, signupBE, logoutBE };
