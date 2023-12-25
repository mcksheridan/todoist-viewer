import * as React from 'react';
import DateIcon from '../assets/img/icon__date.png';
import LabelIcon from '../assets/img/icon__label.png';
import SectionIcon from '../assets/img/icon__section.png';
import type { Task_With_Section_Data } from './project';

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
          <time className="project-task__date">
            <img src={dateIcon.src} alt="" className="project-task__icon" />
            {task.due.string}
          </time>
        ) : (
          ""
        )}
        {task?.section ? (
          <span className="project-task__section">
            <img src={sectionIcon.src} alt="" className="project-task__icon" />
            {task?.section?.name}
          </span>
        ) : (
          ""
        )}
      </div>
      {task?.labels ? (
        <ul className="project-task__labels">
          {task.labels.map((label) => {
            return (
              <li key={`${task.id}-${label}`}>
                <img src={labelIcon.src} alt="" className="project-task__icon" />
                {label}
              </li>
            );
          })}
        </ul>
      ) : (
        ""
      )}
    </article>
  );
}

export default ProjectTask;
