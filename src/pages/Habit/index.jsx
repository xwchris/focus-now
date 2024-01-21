import React, { useState } from "react";

import Tasks from "../../components/Tasks";
import { useHabits } from "../../hooks/useHabits";
import { Button, useColorMode } from "@chakra-ui/react";
import Editor from "../../components/Editor";
import FocusPanel from "../../components/FocusPanel";

const Habit = (props) => {
  const { onTaskChange, ...taskProps } = props;
  const [launchTask, setLaunchTask] = useState(null);
  const onChangeTaskTime = (newTime) => {
    if (launchTask) {
      launchTask.focusSeconds = newTime;
    }
    // TODO - this is not working
    // onTaskChange(launchTask);
  };

  return (
    <div className="pt-[10px]">
      {/* <header>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>
      </header> */}
      <h2 className="font-bold px-5 mb-3 text-base h-[42px] leading-[42px]">
        微习惯
      </h2>
      <div className="px-5">
        {launchTask ? (
          <FocusPanel
            task={launchTask}
            onChangeTaskTime={onChangeTaskTime}
            onClose={() => setLaunchTask(null)}
          />
        ) : (
          <Editor
            onTaskChange={onTaskChange}
            placeholder={"请输入一个要养成的习惯"}
          />
        )}
      </div>
      <div className="mt-3">
        <Tasks
          {...taskProps}
          onTaskChange={onTaskChange}
          launchTask={launchTask}
          setLaunchTask={setLaunchTask}
        />
      </div>
    </div>
  );
};

export default Habit;
