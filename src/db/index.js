import Dexie from 'dexie';
var db = new Dexie("Tasks");
db.version(2).stores({
  tasks: "++id,text,complete,created_at,updated_at,subtasks"
});

export function putTask(task) {
  return db.tasks.put(task);
}

export function getAllTasks() {
  return db.tasks.toArray();
}

export function getTaskById(id) {
  return db.tasks.get(id);
}

export function deleteTask(id) {
  return db.tasks.delete(id);
}


// generate a unique id
export function uuid() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}