// Task.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import TextareaAutosize from "react-textarea-autosize";
import ListIcon from "./icons/list.svg?react";
import Subtask from "../Subtask";

const Task = ({
  task,
  index,
  onTaskChange,
  isExpanded,
  onExpand,
  isSelected,
  onSelect,
  onCloseExpand,
}) => {
  const [taskText, setTaskText] = useState(task.text);
  const [descText, setDescText] = useState(task.description);
  const [prevIsExpanded, setPrevIsExpanded] = useState(isExpanded);
  const focusSubtaskIdRef = useRef(null);
  const isEditable = useMemo(() => task.id === -1, [task.id]);

  useEffect(() => {
    if (prevIsExpanded && !isExpanded) {
      onTaskChange({ ...task, text: taskText, description: descText });
    }
    setPrevIsExpanded(isExpanded);
  }, [isExpanded]);

  const handleInputChange = (e) => {
    setTaskText(e.target.value);
  };

  const handleTextareaChange = (e) => {
    setDescText(e.target.value);
  };

  const handleInputKeyUp = (e) => {
    if (e.key === "Enter" && isEditable) {
      onTaskChange({ ...task, text: taskText, description: descText });
      setTaskText("");
    }
    if (e.key === "Enter" && isExpanded) {
      onCloseExpand();
    }
  };

  const handleDoubleClick = () => {
    onExpand();
  };

  const handleClick = (event) => {
    onSelect();
    event.stopPropagation();
    // if (isExpanded) {
    //   event.stopPropagation();
    // }
  };

  const onSubTaskChange = (newTask) => {
    const newTasks = [...(task.subtasks || [])];
    const index = newTasks.findIndex((task) => task.id === newTask.id);
    if (newTask.id === -1) {
      newTask.id = Date.now();
    }
    if (index === -1) {
      newTasks.push(newTask);
    } else {
      newTasks[index] = newTask;
    }
    onTaskChange({ ...task, subtasks: newTasks });
  };

  const onCreateSubtask = () => {
    onTaskChange({
      ...task,
      subtasks: [...(task.subtasks || []), { id: Date.now() }],
    });
  };

  const onDeleteSubtask = (subtaskId) => {
    const index = task.subtasks.findIndex((task) => task.id === subtaskId);
    if (task.subtasks.length !== 1 && index === 0) {
      return;
    }

    const prevIndex = index - 1;
    focusSubtaskIdRef.current =
      prevIndex >= 0 ? task.subtasks[prevIndex].id : null;

    onTaskChange({
      ...task,
      subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
    });
  };

  return (
    <Draggable
      draggableId={task.id.toString()}
      index={index}
      isDragDisabled={isEditable || isExpanded}
      className="cursor-default"
    >
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-start relative box-border p-2 transition-colors  overflow-hidden duration-200 rounded ${
            isExpanded ? "" : "hover:bg-gray-100"
          } ${isSelected && !isExpanded ? "bg-gray-100" : ""}`}
          // style={
          //   isExpanded
          //     ? {
          //         boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 15px",
          //         padding: "16px 8px",
          //       }
          //     : {}
          // }
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
        >
          <input
            type="checkbox"
            disabled={isEditable}
            checked={task.completed}
            onChange={(e) =>
              onTaskChange({ ...task, completed: e.target.checked })
            }
            className="w-5 h-5 mt-0.5 border-2 shrink-0 border-gray-200 rounded text-blue-600 focus:outline-none disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800 cursor-pointer"
            style={{ boxShadow: "none" }}
          />
          <div className="flex flex-col px-2 flex-grow">
            {isEditable || isExpanded ? (
              <input
                value={taskText}
                placeholder="新建待办事项"
                onChange={handleInputChange}
                onKeyUp={handleInputKeyUp}
                autoFocus={true}
                className="block w-full bg-transparent focus:outline-none border-0 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 p-0"
                style={{ boxShadow: "none" }}
              />
            ) : (
              <p
                className={`outline-none bg-transparent ${
                  task.completed ? "text-gray-500 line-through" : ""
                }`}
              >
                {task.text}
              </p>
            )}
            {isExpanded && (
              <>
                <TextareaAutosize
                  value={descText}
                  placeholder="备注"
                  minRows={3}
                  onChange={handleTextareaChange}
                  style={{ boxShadow: "none" }}
                  className="w-full border-0 text-gray-800 text-sm outline-none bg-transparent focus:outline-none px-0 resize-none"
                />
                <ul>
                  {(task.subtasks || []).map((subtask) => (
                    <Subtask
                      task={subtask}
                      key={subtask.id}
                      focusIdRef={focusSubtaskIdRef}
                      onTaskChange={onSubTaskChange}
                      onCreateSubtask={onCreateSubtask}
                      onDeleteSubtask={onDeleteSubtask}
                    />
                  ))}
                </ul>
                <div className="flex items-center justify-end">
                  {(task.subtasks || []).length === 0 && (
                    <ListIcon
                      onClick={onCreateSubtask}
                      className="w-5 h-5 text-gray-400 p-.5 hover:bg-gray-100 transition-colors rounded cursor-pointer"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default Task;
