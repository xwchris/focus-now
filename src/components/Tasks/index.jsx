import React, { useEffect, useMemo, useState } from "react";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Task from "../Task";
import FocusPanel from "../FocusPanel";

const Tasks = ({ tasks, setTasks, onTaskChange, onTaskDelete }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [launchTask, setLaunchTask] = useState(null);

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

  const onChangeTaskTime = (newTime) => {
    const targetTask = tasks.find((task) => task.id === launchTask.id);
    if (targetTask) {
      targetTask.focusSeconds = newTime;
    }
    // TODO - this is not working
    // onTaskChange(launchTask);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Task
                  onTaskChange={onTaskChange}
                  onTaskDelete={onTaskDelete}
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
      {/* {launchTask && (
        <FocusPanel
          task={launchTask}
          onTaskChange={onTaskChange}
          onClose={() => setLaunchTask(null)}
          onChangeTaskTime={onChangeTaskTime}
        />
      )} */}
    </>
  );
};

export default Tasks;
