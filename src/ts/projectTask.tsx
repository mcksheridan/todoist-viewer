import * as React from 'react';
import type { Task_With_Section_Data } from './project';

const ProjectTask = (task: Task_With_Section_Data) => {
  return (
    <article>
      <h2 dangerouslySetInnerHTML={{__html: task?.content}} />
      {task?.section ?
        <h3>{task?.section?.name}</h3>
      : ''}
      {task?.due ?
        <time>{task.due.string}</time>
      : ''}
      {task?.description ?
        <p dangerouslySetInnerHTML={{__html: task?.description}} />
      : ''}
      {task?.labels ?
        <>
          <h3>Labels</h3>
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
