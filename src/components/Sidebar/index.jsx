import React, { useEffect, useState } from "react";
import cs from "classnames";
import LogoIcon from "./icons/logo.svg?react";
import TodoIcon from "./icons/todo.svg?react";
import HabitIcon from "./icons/habit.svg?react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ tasks, habits }) => {
  const data = [
    { label: "Task", value: tasks.length },
    { label: "Habit", value: habits.length },
    { label: "Day", value: 0 },
  ];

  const location = useLocation();

  return (
    <aside className="w-[260px] flex-shrink-0">
      <h1 className="flex px-3 mb-2 logo h-16 leading-16 text-2xl font-bold items-center">
        <LogoIcon className="w-12 h-12" />
        <span className="ml-2 font-sans">FocusNow</span>
      </h1>
      <div className="flex justify-between px-5">
        {data.map((item, index) => {
          return (
            <div key={index} className="">
              <div className="text-xl font-bold leading-none font-mono">
                {item.value}
              </div>
              <div className="text-xs leading-8">{item.label}</div>
            </div>
          );
        })}
      </div>
      <div className="data px-5"></div>
      <ul className="mt-2">
        <Link to="/">
          <li
            className={cs(
              "flex rounded mt-2 items-center px-5 h-9 cursor-pointer hover:bg-slate-700 transition-colors",
              {
                "bg-slate-700": location.pathname === "/",
              }
            )}
          >
            <TodoIcon className="w-4 h-4 mr-2" />
            <span>待办事项</span>
          </li>
        </Link>
        <Link to="/habit">
          <li
            className={cs(
              "flex rounded mt-2 items-center px-5 h-9 cursor-pointer hover:bg-slate-700 transition-colors",
              {
                "bg-slate-700": location.pathname === "/habit",
              }
            )}
          >
            <HabitIcon className="w-4 h-4 mr-2" />
            <span>微习惯</span>
          </li>
        </Link>
      </ul>
    </aside>
  );
};

export default Sidebar;
