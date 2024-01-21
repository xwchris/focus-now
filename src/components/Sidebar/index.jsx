import React from "react";
import TodayIcon from "./icons/today.svg?react";

const Sidebar = () => {
  const data = [
    { label: "Task", value: 37 },
    { label: "Habit", value: 1 },
    { label: "Day", value: 2 },
  ];

  return (
    <aside className="w-[240px] flex-shrink-0">
      <h1 className="logo h-[64px] leading-[64px] text-2xl font-bold px-[10px]">
        FocusNow
      </h1>
      <div className="flex justify-between px-[10px]">
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
      <div className="data"></div>
      <ul className="mt-2">
        <li className="flex rounded items-center px-[10px] h-9 cursor-pointer hover:bg-slate-700 transition-colors">
          <TodayIcon className="w-4 h-4 mr-2" />
          <span>待办事项</span>
        </li>
        {/* <li className="flex rounded items-center px-[10px] h-9 cursor-pointer hover:bg-slate-700 transition-colors">
          <TodayIcon className="w-4 h-4 mr-2" />
          <span>微习惯</span>
        </li> */}
      </ul>
    </aside>
  );
};

export default Sidebar;
