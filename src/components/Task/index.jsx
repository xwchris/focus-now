// Task.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import TextareaAutosize from "react-textarea-autosize";
import ListIcon from "./icons/list.svg?react";
import RocketIcon from "./icons/rocket.svg?react";
import Subtask from "../Subtask";

const defaultProvided = {
  draggableProps: {},
  droppableProps: {},
  innerRef: () => {},
};

const TaskElement = ({
  task,
  onTaskChange,
  isPure,
  isExpanded = false,
  isEditable = false,
  onExpand = () => {},
  onCloseExpand = () => {},
  onLaunch = () => {},
  provided = defaultProvided,
  ...props
}) => {
  const [taskText, setTaskText] = useState(task.text);
  const [descText, setDescText] = useState(task.description);
  const [isHover, setIsHover] = useState(false);
  const focusSubtaskIdRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (isEditable) {
      setTaskText(value);
    } else {
      onTaskChange({ ...task, text: e.target.value });
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;

    if (isEditable) {
      setDescText(value);
    } else {
      onTaskChange({ ...task, description: e.target.value });
    }
  };

  const handleInputKeyUp = (e) => {
    if (e.key === "Enter" && isEditable) {
      onTaskChange({ ...task, text: taskText, description: descText });
      setTaskText("");
      setDescText("");
    }
    if (e.key === "Enter" && isExpanded) {
      onCloseExpand();
    }
  };

  const handleDoubleClick = () => {
    onExpand();
  };

  const handleFocus = () => {
    if (isEditable) {
    }
  };

  const handleClick = (event) => {
    event.stopPropagation();
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
    const newTask = { id: Date.now() };
    focusSubtaskIdRef.current = newTask.id;
    onTaskChange({
      ...task,
      subtasks: [...(task.subtasks || []), newTask],
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
    <li
      {...props}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`flex items-start relative box-border p-2 transition-colors  overflow-hidden duration-200 rounded ${
        isExpanded ? "py-4 shadow-card" : "hover:bg-gray-100"
      }`}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <input
        type="checkbox"
        disabled={isEditable}
        checked={task.completed}
        onChange={(e) => onTaskChange({ ...task, completed: e.target.checked })}
        className="w-5 h-5 mt-0.5 border-2 shrink-0 border-gray-200 rounded text-blue-600 focus:outline-none disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800 cursor-pointer"
        style={{ boxShadow: "none" }}
      />
      <div className="flex flex-col px-2 flex-grow">
        {(isEditable || isExpanded) && !task.completed ? (
          <input
            value={isEditable ? taskText : task.text}
            placeholder="新建待办事项"
            onChange={handleInputChange}
            onKeyUp={handleInputKeyUp}
            // autoFocus={true}
            onFocus={handleFocus}
            className="block w-full text-slate-800 bg-transparent focus:outline-none border-0 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 p-0"
            style={{ boxShadow: "none" }}
          />
        ) : (
          <div className="flex items-center">
            <p
              className={`outline-none bg-transparent flex-grow text-slate-800 ${
                task.completed ? "text-slate-400 line-through" : ""
              }`}
            >
              {task.text}
            </p>
            {isHover && !isExpanded && (
              <RocketIcon
                className="w-4 h-4 text-gray-500 cursor-pointer transition-colors hover:text-blue-600"
                onClick={onLaunch}
              />
            )}
          </div>
        )}
        {isExpanded && !isEditable && (
          <>
            <TextareaAutosize
              value={isEditable ? descText : task.description}
              placeholder="备注"
              onChange={handleTextareaChange}
              style={{ boxShadow: "none" }}
              className="w-full border-0 text-gray-600 text-sm outline-none bg-transparent focus:outline-none px-0 resize-none"
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
                  className="w-5 h-5 text-gray-500 p-.5 border border-transparent hover:border-gray-300 transition-colors rounded cursor-pointer"
                />
              )}
            </div>
          </>
        )}
      </div>
    </li>
  );
};

const Task = ({ task, index, isExpanded, isPure, ...props }) => {
  const isEditable = useMemo(() => task.id === -1, [task.id]);

  if (isPure) {
    return (
      <TaskElement
        {...props}
        isExpanded={isExpanded}
        isEditable={isEditable}
        task={task}
        isPure={isPure}
      />
    );
  }
  return (
    <Draggable
      draggableId={task.id.toString()}
      index={index}
      isDragDisabled={isEditable || isExpanded}
      className="cursor-default"
    >
      {(provided) => (
        <TaskElement
          {...props}
          isExpanded={isExpanded}
          isEditable={isEditable}
          task={task}
          provided={provided}
        />
      )}
    </Draggable>
  );
};

export default Task;
