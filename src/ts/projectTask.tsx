import * as React from 'react';
import type { Task_With_Section_Data } from './project';

const ProjectTask = (task: Task_With_Section_Data) => {
  return (
    <article>
      <h3 dangerouslySetInnerHTML={{__html: task?.content}} />
      {task?.section ?
        <p>{task?.section?.name}</p>
      : ''}
      {task?.due ?
        <time>{task.due.string}</time>
      : ''}
      {task?.description ?
        <p dangerouslySetInnerHTML={{__html: task?.description}} />
      : ''}
      {task?.labels ?
        <>
          <h4>Labels</h4>
          <ul>
            {task.labels.map((label) => {
              return <li key={`${task.id}-${label}`}>{label}</li>
            })}
          </ul>
        </>
      : ''}
    </article>
  )
}

export default ProjectTask;
