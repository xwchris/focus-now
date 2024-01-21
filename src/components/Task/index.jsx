// Task.jsx
import React, { useState, useMemo } from "react";
import { Draggable } from "@hello-pangea/dnd";
import {
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import cs from "classnames";
import MoreIcon from "./icons/more.svg?react";
import RocketIcon from "./icons/rocket.svg?react";
import Editor from "../Editor";
import "./index.css";

const Task = ({
  task,
  index,
  isLaunch,
  onTaskChange,
  onTaskDelete,
  setLaunchTask,
  ...props
}) => {
  const onSubTaskChange = ({ index, completed }) => {
    const subtasks = [...(task.subtasks || [])];
    const subtask = subtasks[index];
    subtask.completed = completed;
    onTaskChange({ ...task, subtasks });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <Draggable
      draggableId={task.id.toString()}
      index={index}
      isDragDisabled={isEditing}
      className="cursor-default"
    >
      {(provided) => (
        <li
          {...props}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => {
            if (!isLaunch) setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
          className={cs(
            "relative box-border py-2 px-5 rounded transition-colors",
            {
              "hover:bg-gray-700": !isEditing,
            }
          )}
        >
          {isEditing ? (
            <Editor
              task={task}
              onTaskChange={onTaskChange}
              onClose={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div className="flex items-start relative">
                <Checkbox
                  isChecked={task.completed}
                  className="flex-1 items-start"
                  onChange={(e) =>
                    onTaskChange({ ...task, completed: e.target.checked })
                  }
                >
                  <span
                    className={cs("leading-6", {
                      "line-through": task.completed,
                    })}
                  >
                    {task.text || "暂无内容"}
                  </span>
                </Checkbox>
                <div
                  className={cs(
                    "absolute flex items-center z-10 right-0 bg-slate-700 flex-shrink-0 ",
                    {
                      hidden: !hover,
                    }
                  )}
                >
                  <RocketIcon
                    onClick={() => setLaunchTask(task)}
                    className={cs(
                      "ml-3 w-4 h-4 text-white hover:text-orange-600 transition-colors"
                    )}
                  />
                  <Menu>
                    <MenuButton className="text-white hover:text-orange-600">
                      <MoreIcon
                        // as={Button}
                        className={cs("ml-3 w-6 h-6 transition-colors")}
                      />
                    </MenuButton>
                    <Portal>
                      <MenuList>
                        <MenuItem onClick={() => setIsEditing(true)}>
                          编辑
                        </MenuItem>
                        <MenuItem onClick={() => onTaskDelete(task.id)}>
                          删除
                        </MenuItem>
                      </MenuList>
                    </Portal>
                  </Menu>
                </div>
              </div>
              <div className="px-4">
                <ul>
                  {(task.subtasks || []).map((subtask, index) => (
                    <div key={index}>
                      <Checkbox
                        isChecked={subtask.completed}
                        onChange={(e) =>
                          onSubTaskChange({
                            index: index,
                            completed: e.target.checked,
                          })
                        }
                        className="mt-2"
                      >
                        <span
                          className={cs({ "line-through": subtask.completed })}
                        >
                          {subtask.text}
                        </span>
                      </Checkbox>
                    </div>
                  ))}
                </ul>
              </div>
            </>
          )}
        </li>
      )}
    </Draggable>
  );
};

export default Task;
