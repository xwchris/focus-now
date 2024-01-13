// Task.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import TextareaAutosize from "react-textarea-autosize";
import ListIcon from "./icons/list.svg?react";
import DeleteIcon from "./icons/delete.svg?react";
import RocketIcon from "./icons/rocket.svg?react";
import AIICon from "./icons/ai.svg?react";
import EneterIcon from "./icons/enter.svg?react";
import Subtask from "../Subtask";
import apis from "../../apis";

const defaultProvided = {
  draggableProps: {},
  droppableProps: {},
  innerRef: () => {},
};

const TaskElement = ({
  task,
  onTaskChange,
  onTaskDelete,
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
  const [isSubtaskHover, setIsSubtaskHover] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const onAIActionable = async () => {
    const text = task.text || "";
    if (text.length > 0) {
      setLoading(true);
      // request result from apis.sendMessages
      await apis.sendMessages({ message: text }, (res, isFinish) => {
        // set result
        // 替换res的头部[和尾部]设置为finalText
        const finalText = res.replace(/^\[|\]$/g, "");
        onTaskChange({ ...task, text: finalText });
        setLoading(!isFinish);
      });
    }
  };

  const onAISubtasks = async () => {
    const text = task.text || "";
    setLoading(true);
    if (text.length > 0) {
      await apis.sendMessages(
        { message: text, type: "subtask" },
        (res, isFinish) => {
          // set result
          // 替换res的头部[和尾部]设置为finalText
          const lines = res.split("\n");
          const subtasks = lines.map((line, index) => {
            // 匹配以[开始非]的字符
            const match = line.match(/^\[([^\]]+)/);
            const subtext = match ? match[1] : line;
            return { id: Date.now() + index, text: subtext };
          });
          onTaskChange({ ...task, text, subtasks });
          setLoading(!isFinish);
        }
      );
    }
  };

  const handleInputKeyUp = async (e) => {
    if (e.key === "Enter" && isEditable) {
      onTaskChange({ ...task, text: taskText, description: descText });
      e.target.blur();
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

  const handleClick = (event) => {
    if (isEditable || isExpanded) {
      event.stopPropagation();
    }
  };

  const handleFocus = (event) => {
    if (isEditable) {
      onExpand();
    }
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

  const onCreateSubtask = (subtaskId) => {
    const subtasks = [...(task.subtasks || [])];
    const index = subtasks.findIndex((task) => task.id === subtaskId);
    const nextIndex = index === -1 ? subtasks.length : index + 1;
    const newTask = { id: Date.now() };
    focusSubtaskIdRef.current = newTask.id;
    subtasks.splice(nextIndex, 0, newTask);
    onTaskChange({
      ...task,
      subtasks,
    });
  };

  const onDeleteSubtask = (subtaskId) => {
    const index = task.subtasks.findIndex((task) => task.id === subtaskId);
    // if (task.subtasks.length !== 1 && index === 0) {
    //   return;
    // }

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
      className={`flex items-start relative box-border p-2 transition-colors duration-200 rounded ${
        isExpanded ? "py-4 shadow-card" : "hover:bg-gray-100"
      }`}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <input
        type="checkbox"
        disabled={isEditable || loading}
        checked={task.completed}
        onChange={(e) => onTaskChange({ ...task, completed: e.target.checked })}
        className="w-5 h-5 mt-0.5 border-2 shrink-0 border-gray-200 rounded text-blue-600 focus:outline-none disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800 cursor-pointer"
        style={{ boxShadow: "none" }}
      />
      <div className="flex flex-col px-2 flex-grow">
        <div
          className={`flex items-center ${
            (isEditable || isExpanded) && !task.completed ? "" : "hidden"
          }`}
        >
          <input
            value={isEditable ? taskText : task.text}
            placeholder="新建待办事项"
            onChange={handleInputChange}
            disabled={loading}
            onFocus={handleFocus}
            onKeyUp={handleInputKeyUp}
            className="block w-full text-slate-800 bg-transparent focus:outline-none border-0 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 p-0"
            style={{ boxShadow: "none" }}
          />
          {loading ? (
            <span
              className={`animate-spin ml-4 inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full`}
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </span>
          ) : (
            !isEditable && (
              <AIICon
                className={`ml-4 w-5 h-5 cursor-pointer transition-colors ${
                  (task.text || "").length > 0
                    ? "text-blue-600 hover:text-blue-500"
                    : "text-gray-500"
                }`}
                onClick={onAIActionable}
              />
            )
          )}
          {isEditable && isExpanded && (
            <kbd class="inline-flex justify-center items-center font-mono text-xs text-gray-400 rounded-md dark:text-gray-600">
              <EneterIcon className="h-6 w-8" />
            </kbd>
          )}
        </div>
        <div
          className={`flex items-center ${
            (isEditable || isExpanded) && !task.completed ? "hidden" : ""
          }`}
        >
          <p
            className={`outline-none bg-transparent flex-grow  ${
              task.completed ? "text-slate-400 line-through" : "text-slate-800"
            }`}
          >
            {task.text}
          </p>
          {isHover && !isExpanded && (
            <RocketIcon
              className="w-4 h-4 text-slate-500 cursor-pointer transition-colors hover:text-blue-600"
              onClick={onLaunch}
            />
          )}
        </div>
        {isExpanded && !isEditable && (
          <>
            <TextareaAutosize
              value={isEditable ? descText : task.description}
              disabled={loading}
              placeholder="备注"
              onChange={handleTextareaChange}
              style={{ boxShadow: "none" }}
              className="w-full border-0 text-gray-600 text-sm outline-none bg-transparent focus:outline-none px-0 resize-none"
            />

            <ul>
              {(task.subtasks || []).map((subtask, index) => (
                <Subtask
                  task={subtask}
                  key={subtask.id}
                  disabled={loading}
                  focusIdRef={focusSubtaskIdRef}
                  onTaskChange={onSubTaskChange}
                  onCreateSubtask={onCreateSubtask}
                  onDeleteSubtask={onDeleteSubtask}
                />
              ))}
            </ul>
            <div className="flex items-center justify-end">
              {(task.subtasks || []).length === 0 && (
                <div
                  className="flex items-center justify-end"
                  onMouseEnter={() => setIsSubtaskHover(true)}
                  onMouseLeave={() => setIsSubtaskHover(false)}
                >
                  <AIICon
                    className={`${
                      isSubtaskHover ? "w-5" : "w-0"
                    } h-5 mr-1 border border-transparent transition-all rounded cursor-pointer ${
                      (task.text || "").length > 0
                        ? "text-blue-600 hover:text-blue-500"
                        : "text-gray-500"
                    }`}
                    onClick={onAISubtasks}
                  />
                  <ListIcon
                    onClick={() => onCreateSubtask()}
                    className="w-6 h-6 text-gray-500 p-.5 border border-transparent hover:border-gray-300 transition-colors rounded cursor-pointer"
                  />
                </div>
              )}
              {!isPure && (
                <DeleteIcon
                  onClick={() => onTaskDelete(task.id)}
                  className="w-6 h-6 text-gray-500 ml-2 p-.5 border border-transparent hover:border-gray-300 transition-colors rounded cursor-pointer"
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
