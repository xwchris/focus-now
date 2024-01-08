import React, { useState } from "react";
import Tasks from "../../components/Tasks";

const Today = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Task 1", completed: false },
    { id: 2, text: "Task 2", completed: true },
    { id: 3, text: "Task 3", completed: false },
  ]);

  return (
    <div>
      <div className="w-[630px] mx-auto mt-8">
        <h1 className="font-bold mb-3 text-2xl px-2">今日待办</h1>
        <Tasks tasks={tasks} setTasks={setTasks} />
      </div>
    </div>
  );
};

export default Today;
