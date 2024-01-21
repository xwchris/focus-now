
import { deleteTask, getAllTasks, putTask, uuid } from "../db";
import { useState, useEffect } from 'react';

export function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getAllTasks().then((tasks) => {
      setTasks(tasks);
    });
  }, []);

  const onTaskChange = (newTask) => {
    const newTasks = [...tasks];
    if (!newTask.id) {
      const task = { ...newTask, id: uuid() };
      putTask(task);
      newTasks.push(task);
    } else {
      const index = newTasks.findIndex((task) => task.id === newTask.id);
      newTasks[index] = newTask;

      // update task
      putTask(newTask);
      setTasks(newTasks);
    }
    setTasks(newTasks);
  };

  const onTaskDelete = (taskId) => {
    deleteTask(taskId);
    const newTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(newTasks);
  };

  return { tasks, onTaskChange, setTasks, onTaskDelete }
}