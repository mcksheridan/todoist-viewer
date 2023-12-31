import * as React from "react";
import TextWithIcon from "./textWithIcon";
import { pageIcon } from "../utilities/images";

import type { Tasks_Per_Page } from "../types";

const TasksPerPage = ({
  action,
  taskNumbers,
  totalTasks,
}: Tasks_Per_Page): JSX.Element | JSX.Element[] => {
  const sortedTaskNumbers = taskNumbers.sort((a, b) => a - b);

  return (
    <div>
      <label className="label-with-icon">
        <TextWithIcon image={pageIcon.src} text="Tasks per page" />
        <select
          className="label-with-icon__select label-with-icon__select--small"
          onChange={(event) => action(parseInt(event.target.value))}
        >
          {sortedTaskNumbers.map((taskNumber) => (
            <option
              key={`task-${taskNumber}`}
              value={taskNumber}
              disabled={totalTasks < taskNumber}
            >
              {taskNumber}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default TasksPerPage;
