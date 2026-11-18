const STORAGE_KEY = "fsd-task-manager.tasks";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskSummary = document.querySelector("#task-summary");
const filters = document.querySelectorAll(".filter");
const clearCompletedButton = document.querySelector("#clear-completed");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }
  return tasks;
}

function render() {
  const visibleTasks = getVisibleTasks();
  const activeCount = tasks.filter((task) => !task.completed).length;
  taskSummary.textContent = `${activeCount} active ${activeCount === 1 ? "task" : "tasks"} · ${tasks.length} total`;
  taskList.replaceChildren();

  if (visibleTasks.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = currentFilter === "all" ? "No tasks yet." : `No ${currentFilter} tasks.`;
    taskList.append(emptyState);
    return;
  }

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.className = "task-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} ${task.completed ? "active" : "completed"}`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      render();
    });

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((candidate) => candidate.id !== task.id);
      saveTasks();
      render();
    });

    item.append(checkbox, title, deleteButton);
    taskList.append(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  tasks.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    completed: false,
  });
  input.value = "";
  saveTasks();
  render();
});

filters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    currentFilter = filterButton.dataset.filter;
    filters.forEach((button) => button.classList.toggle("active", button === filterButton));
    render();
  });
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

render();
