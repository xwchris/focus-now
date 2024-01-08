import React, { useEffect, useMemo, useState } from "react";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Task from "../Task";

const emptyTask = { id: -1, text: "", completed: false };

const Tasks = ({ tasks, setTasks }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectTaskId, setSelectTaskId] = useState(null);

  useEffect(() => {
    const handleClick = () => {
      setExpandedTaskId(null);
      setSelectTaskId(null);
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

  const realTasks = useMemo(() => [...tasks, emptyTask], [tasks]);

  return (
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
                isSelected={task.id === selectTaskId}
                onSelect={() => setSelectTaskId(task.id)}
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
  );
};

export default Tasks;
