import React, { useState, useEffect } from "react";
import RocketIcon from "./icons/rocket.svg?react";
import CoffeeIcon from "./icons/coffee.svg?react";
import { Button } from "@chakra-ui/react";
// import ShrinkIcon from "./icons/shrink.svg?react";
// import Task from "../Task";

const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const FocusPanel = ({ task, onChangeTaskTime, onClose }) => {
  const [timer, setTimer] = useState(task.focusSeconds || 0);
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

  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-white text-sm">专注持续时间</p>
        <div className={`text-3xl w-[150px] font-medium text-white`}>
          {formatTime(timer)}
        </div>
      </div>
      <div className="flex">
        {isRunning ? (
          <button
            type="button"
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded border border-transparent bg-slate-600 text-white hover:bg-orange-500 transition-colors"
            onClick={stopTimer}
          >
            暂停
          </button>
        ) : (
          <>
            <button
              type="button"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded border border-transparent bg-orange-600 text-white hover:bg-orange-500 transition-colors"
              onClick={startTimer}
            >
              继续
            </button>
            <button
              type="button"
              className="ml-2 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded border border-transparent bg-slate-600 text-white hover:bg-red-500 transition-colors"
              onClick={onClose}
            >
              结束
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FocusPanel;
