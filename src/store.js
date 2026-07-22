let tasks = [];
let nextId = 1;

export function getTasks() {
  return tasks
    .map((task) => ({ ...task }))
    .sort((a, b) => a.id - b.id);
}

export function createTask(title) {
  const task = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

export function updateTask(id, patch) {
  const idx = tasks.findIndex((task) => task.id === id);
  if (idx === -1) return null;

  tasks[idx] = { ...tasks[idx], ...patch, id: tasks[idx].id };
  return tasks[idx];
}

export function deleteTask(id) {
  const idx = tasks.findIndex((task) => task.id === id);
  if (idx === -1) return null;

  const [deletedTask] = tasks.splice(idx, 1);
  return deletedTask;
}

export function _resetForTests() {
  tasks = [];
  nextId = 1;
}
