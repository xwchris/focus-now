import React from "react";
import Tasks from "../../components/Tasks";
import { useTasks } from "../../hooks/useTasks";

const Today = () => {
  const taskProps = useTasks();

  return (
    <div>
      <div className="w-[630px] mx-auto mt-8">
        <h1 className="font-bold mb-3 text-2xl px-2">今日待办</h1>
        <Tasks {...taskProps} />
      </div>
    </div>
  );
};

export default Today;
