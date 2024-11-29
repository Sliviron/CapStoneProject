const API_BASE_URL = "http://localhost:5000";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const authForms = document.getElementById("auth-forms");
const taskManager = document.getElementById("task-manager");

let token = "";

// Show forms
loginBtn.addEventListener("click", () => {
  authForms.classList.remove("hidden");
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

registerBtn.addEventListener("click", () => {
  authForms.classList.remove("hidden");
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

// Register user
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
    alert("Registration successful!");
    registerForm.reset();
  } else {
    alert("Registration failed.");
  }
});

// Login user
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    token = data.token;
    authForms.classList.add("hidden");
    taskManager.classList.remove("hidden");
    fetchTasks();
  } else {
    alert("Login failed.");
  }
});

// Fetch tasks
async function fetchTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: { Authorization: token },
  });

  if (response.ok) {
    const tasks = await response.json();
    renderTasks(tasks);
  }
}

// Render tasks
function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = `${task.title} - ${task.priority}`;
    taskList.appendChild(li);
  });
}

// Add task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const deadline = document.getElementById("task-deadline").value;
  const priority = document.getElementById("task-priority").value;

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ title, description, deadline, priority }),
  });

  if (response.ok) {
    fetchTasks();
    taskForm.reset();
  } else {
    alert("Failed to add task.");
  }
});
