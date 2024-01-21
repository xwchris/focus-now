
import { deleteHabit, getAllHabits, putHabit, uuid } from "../db";
import { useState, useEffect } from 'react';

export function useHabits() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getAllHabits().then((tasks) => {
      setTasks(tasks);
    });
  }, []);

  const onTaskChange = (newTask) => {
    const newTasks = [...tasks];
    if (!newTask.id) {
      const task = { ...newTask, id: uuid() };
      putHabit(task);
      newTasks.unshift(task);
    } else {
      const index = newTasks.findIndex((task) => task.id === newTask.id);
      newTasks[index] = newTask;

      // update task
      putHabit(newTask);
      setTasks(newTasks);
    }
    setTasks(newTasks);
  };

  const onTaskDelete = (taskId) => {
    deleteHabit(taskId);
    const newTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(newTasks);
  };

  return { tasks, onTaskChange, setTasks, onTaskDelete }
}