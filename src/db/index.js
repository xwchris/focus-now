import Dexie from 'dexie';
var db = new Dexie("Tasks");
db.version(5).stores({
  tasks: "++id,text,originalText,complete,created_at,updated_at,subtasks",
  habits: "++id,text,originalText,complete,created_at,updated_at,subtasks"
});


export function putTask(task) {
  return db.tasks.put(task);
}

export function getAllTasks() {
  return db.tasks.toArray();
}

// get tasks count
export function getTasksCount() {
  return db.tasks.count();
}

export function getTaskById(id) {
  return db.tasks.get(id);
}

export function deleteTask(id) {
  return db.tasks.delete(id);
}

// habits
export function putHabit(habit) {
  return db.habits.put(habit);
}

export function getAllHabits() {
  return db.habits.toArray();
}

// get habits count
export function getHabitsCount() {
  return db.habits.count();
}

export function getHabitById(id) {
  return db.habits.get(id);
}

export function deleteHabit(id) {
  return db.habits.delete(id);
}


// generate a unique id
export function uuid() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}