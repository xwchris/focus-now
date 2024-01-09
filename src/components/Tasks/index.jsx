import React, { useEffect, useMemo, useState } from "react";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Task from "../Task";
import FocusPanel from "../FocusPanel";

const emptyTask = { id: -1, text: "", completed: false };

const Tasks = ({ tasks, setTasks }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [launchTask, setLaunchTask] = useState(null);

  useEffect(() => {
    const handleClick = () => {
      setExpandedTaskId(null);
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  const onTaskChange = (newTask) => {
    const newTasks = [...tasks];
    if (newTask.id === -1) {
      newTasks.push({ ...newTask, id: Date.now() });
      setTasks(newTasks);
      return;
    } else {
      const index = newTasks.findIndex((task) => task.id === newTask.id);
      newTasks[index] = newTask;
      setTasks(newTasks);
    }
  };

  const onChangeTaskTime = (newTime) => {
    const targetTask = tasks.find((task) => task.id === launchTask.id);
    if (targetTask) {
      targetTask.focusSeconds = newTime;
    }
    // TODO - this is not working
    // onTaskChange(launchTask);
  };

  const realTasks = useMemo(() => [...tasks, emptyTask], [tasks]);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {realTasks.map((task, index) => (
                <Task
                  onTaskChange={onTaskChange}
                  isExpanded={task.id === expandedTaskId}
                  onExpand={() => setExpandedTaskId(task.id)}
                  onCloseExpand={() => setExpandedTaskId(null)}
                  onLaunch={() => setLaunchTask(task)}
                  key={task.id}
                  task={task}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {launchTask && (
        <FocusPanel
          task={launchTask}
          onTaskChange={onTaskChange}
          onClose={() => setLaunchTask(null)}
          onChangeTaskTime={onChangeTaskTime}
        />
      )}
    </>
  );
};

export default Tasks;
