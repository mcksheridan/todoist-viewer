import * as React from "react";
import DateIcon from "../assets/img/icon__date.png";
import LabelIcon from "../assets/img/icon__label.png";
import SectionIcon from "../assets/img/icon__section.png";
import type { Task_With_Section_Data } from "./project";
import TextWithIcon from "./cmp/textWithIcon";

const dateIcon = new Image();
dateIcon.src = DateIcon;
const labelIcon = new Image();
labelIcon.src = LabelIcon;
const sectionIcon = new Image();
sectionIcon.src = SectionIcon;

const ProjectTask = (task: Task_With_Section_Data): JSX.Element => {
  return (
    <article className="project-task">
      <h2
        dangerouslySetInnerHTML={{ __html: task?.content }}
        className="project-task__content"
      />
      {task?.description ? (
        <p
          dangerouslySetInnerHTML={{ __html: task?.description }}
          className="project-task__description"
        />
      ) : (
        ""
      )}
      <div className="project-task__info">
        {task?.due ? (
          <TextWithIcon
            elementType="time"
            image={dateIcon.src}
            text={task.due.string}
            hasWarning={new Date(task.due.date) < new Date(Date.now())}
          />
        ) : (
          ""
        )}
        {task?.section ? (
          <TextWithIcon image={sectionIcon.src} text={task?.section?.name} />
        ) : (
          ""
        )}
      </div>
      {task?.labels ? (
        <ul className="project-task__labels">
          {task.labels.map((label) => {
            return (
              <TextWithIcon
                elementType="li"
                image={labelIcon.src}
                key={`${task.id}-${label}`}
                text={label}
              />
            );
          })}
        </ul>
      ) : (
        ""
      )}
    </article>
  );
};

export default ProjectTask;
