import React, { useEffect, useRef } from "react";

const Subtask = ({
  task,
  onTaskChange,
  focusIdRef,
  onCreateSubtask,
  onDeleteSubtask,
}) => {
  const inputRef = useRef();
  const handleInputKeyUp = (e) => {
    if (e.key === "Enter") {
      onCreateSubtask();
      e.target.blur(); // Cancels the focus on the current input
    }
    if (e.key === "Backspace" && !task.text) {
      onDeleteSubtask(task.id);
    }
  };

  // useEffect(() => {
  //   inputRef.current.focus(); // Set focus to the input element after each render
  // }, []); // Check if the initial task id is -1

  useEffect(() => {
    if (focusIdRef.current !== null && task.id === focusIdRef.current) {
      inputRef.current.focus();
      focusIdRef.current = null;
    }
  }, [focusIdRef.current]);

  return (
    <li className="flex items-center py-1">
      <input
        type="checkbox"
        checked={!!task.completed}
        onChange={(e) => onTaskChange({ ...task, completed: e.target.checked })}
        className="w-4 h-4 border-2 shrink-0 border-blue-600 rounded-full text-gray-400 focus:outline-none disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800 cursor-pointer"
        style={{ boxShadow: "none" }}
      />
      <input
        ref={inputRef}
        className={`p-0 mx-2 flex-grow outline-none bg-transparent border-0 shadow-none text-sm text-slate-800 ${
          task.completed ? "text-slate-400" : ""
        }`}
        style={{ boxShadow: "none" }}
        value={task.text || ""}
        onChange={(e) => onTaskChange({ ...task, text: e.target.value })}
        onKeyUp={handleInputKeyUp}
      />
    </li>
  );
};

export default Subtask;
