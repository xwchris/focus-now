import React, { useState, useEffect } from "react";
import RocketIcon from "./icons/rocket.svg?react";
import CoffeeIcon from "./icons/coffee.svg?react";
import ShrinkIcon from "./icons/shrink.svg?react";
import Task from "../Task";

const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const FocusPanel = ({ task, onClose, onTaskChange, onChangeTaskTime }) => {
  const [timer, setTimer] = useState(task.focusSeconds || 0);
  const [itask, setItask] = useState(task);
  const [isRunning, setIsRunning] = useState(true);
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          const nextTime = prevTimer + 1;
          onChangeTaskTime(nextTime);
          return nextTime;
        });
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, onChangeTaskTime]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const onITaskChange = (newTask) => {
    setItask(newTask);
    onTaskChange(newTask);
  };

  const onFinishAll = () => {
    onITaskChange({
      ...itask,
      completed: true,
      subtasks: (itask.subtasks || []).map((subtask) => ({
        ...subtask,
        completed: true,
      })),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center">
      <ShrinkIcon
        className="w-6 h-6 text-slate-400 fixed right-6 top-6 hover:text-blue-600 cursor-pointer transition-colors"
        onClick={onClose}
      />
      <div className="flex justify-between items-center w-[600px] mt-12">
        <div>
          <p className="text-slate-400 text-sm">专注持续时间</p>
          <div
            className={`text-3xl w-[150px] font-medium ${
              isRunning ? "text-slate-700" : "text-slate-700"
            }`}
          >
            {formatTime(timer)}
          </div>
        </div>
        <div className="flex">
          {isRunning ? (
            <button
              type="button"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              onClick={stopTimer}
            >
              <CoffeeIcon className="w-5 h-5 text-white" />
              休息一下
            </button>
          ) : (
            <button
              type="button"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              onClick={startTimer}
            >
              <RocketIcon className="w-5 h-5 text-white" />
              开始专注
            </button>
          )}
          <button
            type="button"
            className="ml-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            onClick={onFinishAll}
          >
            完成事项
          </button>
        </div>
      </div>
      <div className="mt-12 w-[600px]">
        <Task task={itask} onTaskChange={onITaskChange} isPure isExpanded />
      </div>
    </div>
  );
};

export default FocusPanel;
