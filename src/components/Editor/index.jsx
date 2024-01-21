import React, { useEffect, useState } from "react";
import cs from "classnames";
import TextareaAutosize from "react-textarea-autosize";
import SendIcon from "./icons/send.svg?react";
import ListIcon from "./icons/list.svg?react";
import AIIcon from "./icons/ai.svg?react";
import LoadingIcon from "./icons/loading.svg?react";
import apis from "../../apis";

function formatValue(value = "") {
  const text = value.trim();
  // 将文本的中的 - xxx形式提取成一个个subtask，其余的作为title
  const lines = text.split("\n");
  const reg = /- (.+)/g;
  const subtasks = [];
  let title = "";
  lines.forEach((line) => {
    const matches = line.trim().match(reg);
    if (matches) {
      const subtext = matches[0].slice(2);
      subtasks.push({ text: subtext, completed: false });
    } else {
      title += `${line}\n`;
    }
  });

  return { text: title.trim(), subtasks };
}

const Editor = ({ task, onTaskChange, placeholder, onClose = () => {} }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task && task.id) {
      setValue(task.originalText || "");
    }
  }, [task]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    if (loading) {
      return;
    }
    const newTask = {
      ...task,
      ...formatValue(value),
      originalText: value,
    };

    onTaskChange(newTask);
    setValue("");
    onClose();
  };

  const onAppendSubtask = () => {
    if (loading) {
      return;
    }
    setValue(`${value}\n- `);
  };

  const onAIPerf = async () => {
    // const { text } = formatValue(value);
    if (value.length > 0) {
      setLoading(true);
      // request result from apis.sendMessages
      await apis.sendMessages({ message: value }, (res, isFinish) => {
        // set result
        // 替换res的头部[和尾部]设置为finalText
        // const finalText = res.replace(/^\[|\]$/g, "");
        setValue(res);
        setLoading(!isFinish);
      });
    }
  };

  return (
    <div className="rounded border-2 border-gray-700 px-3 py-2">
      <TextareaAutosize
        value={value}
        minRows={3}
        placeholder={placeholder}
        onChange={handleChange}
        style={{ boxShadow: "none" }}
        className="w-full border-0 text-base outline-none bg-transparent focus:outline-none px-0 resize-none"
      />
      <div className="flex justify-between">
        {loading ? (
          <div className="flex-1 flex items-center text-orange-600">
            <LoadingIcon className="mr-1 w-6 h-6 p-1 animate-spin" />
            <span className="text-sm">AI润色中...</span>
          </div>
        ) : (
          <div className="flex-1 flex items-center">
            <ListIcon
              onClick={onAppendSubtask}
              className="w-6 h-6 text-white rounded p-1 hover:bg-slate-600 cursor-pointer transition-colors"
            />
            <AIIcon
              onClick={onAIPerf}
              className="ml-2 w-6 h-6 text-white rounded p-1 hover:bg-slate-600 cursor-pointer transition-colors"
            />
          </div>
        )}
        {task && task.id && !loading && (
          <div
            onClick={onClose}
            className="mr-2 w-12 h-7 flex justify-center items-center rounded cursor-pointer transition-colors hover:bg-slate-600"
          >
            取消
          </div>
        )}
        <div
          className={cs(
            "w-12 h-7 flex justify-center items-center rounded bg-slate-600 cursor-pointer transition-colors hover:bg-orange-600",
            {
              "opacity-0": loading,
            }
          )}
        >
          <SendIcon className="w-4" onClick={handleClick} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
