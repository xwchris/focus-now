import React, { useState } from "react";

import Tasks from "../../components/Tasks";
import { useTasks } from "../../hooks/useTasks";
import { Button, useColorMode } from "@chakra-ui/react";
import Editor from "../../components/Editor";

const Today = () => {
  const { onTaskChange, ...taskProps } = useTasks();

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className="pt-[10px]">
      {/* <header>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>
      </header> */}
      <h2 className="font-bold px-3 mb-3 text-base h-[42px] leading-[42px]">
        待办事项
      </h2>
      <div className="px-3">
        <Editor onTaskChange={onTaskChange} />
      </div>
      <div className="mt-3">
        <Tasks {...taskProps} onTaskChange={onTaskChange} />
      </div>
    </div>
  );
};

export default Today;
