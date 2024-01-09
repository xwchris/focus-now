import React, { useState } from "react";
import Tasks from "../../components/Tasks";

const Tomorrow = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Task 12", completed: true },
    { id: 2, text: "Task 22", completed: true },
    { id: 3, text: "Task 32", completed: false },
  ]);

  return (
    <div>
      <div className="w-[630px] mx-auto mt-8">
        <h1 className="font-bold mb-3 text-2xl px-2">明日待办</h1>
        <Tasks tasks={tasks} setTasks={setTasks} />
      </div>
    </div>
  );
};

export default Tomorrow;
