import * as React from "react";
import PageIcon from "../../assets/img/icon__page.png";
import TextWithIcon from "./textWithIcon";

type Tasks_Per_Page_type = {
  action: (value: React.SetStateAction<number>) => void;
  taskNumbers: number[];
  totalTasks: number;
};

const pageIcon = new Image();
pageIcon.src = PageIcon;

const TasksPerPage = ({
  action,
  taskNumbers,
  totalTasks,
}: Tasks_Per_Page_type): JSX.Element | JSX.Element[] => {
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
