const STORAGE_KEY_USER_NAME = "cafesilloUserName";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");

  if (!form || !usernameInput) {
    return;
  }

  const savedName = localStorage.getItem(STORAGE_KEY_USER_NAME);
  if (savedName) {
    usernameInput.value = savedName;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = usernameInput.value.trim();
    if (!name) {
      usernameInput.focus();
      return;
    }

    localStorage.setItem(STORAGE_KEY_USER_NAME, name);
    window.location.href = "main.html";
  });
});
