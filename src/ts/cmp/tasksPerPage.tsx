import * as React from "react";
import PageIcon from "../../assets/img/icon__page.png";

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
        <span>
          <img src={pageIcon.src} alt="" />
          Tasks per page
        </span>
        <select>
          {sortedTaskNumbers.map((taskNumber) => (
            <option
              key={"task-" + taskNumber}
              onClick={() => action(taskNumber)}
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
