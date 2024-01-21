import React, { useEffect, useMemo, useState } from "react";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Task from "../Task";
import FocusPanel from "../FocusPanel";

const Tasks = ({
  tasks,
  launchTask,
  setLaunchTask,
  setTasks,
  onTaskChange,
  onTaskDelete,
}) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    const handleClick = () => {
      // find current expanded task
      const expandedTask = tasks.find((task) => task.id === expandedTaskId);
      // if expanded task is loading, do nothing
      if (expandedTask && expandedTask.loading) return;
      setExpandedTaskId(null);
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [expandedTaskId]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  const realTask = launchTask
    ? tasks.filter((t) => t.id === launchTask.id)
    : tasks;

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {realTask.map((task, index) => (
                <Task
                  onTaskChange={onTaskChange}
                  onTaskDelete={onTaskDelete}
                  setLaunchTask={setLaunchTask}
                  key={task.id}
                  task={task}
                  isLaunch={launchTask && launchTask.id === task.id}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default Tasks;
