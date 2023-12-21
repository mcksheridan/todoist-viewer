import * as React from 'react';
import { getProjectName, getProjectSections, getProjectTasks } from './utils/todoist';
import {
  getSectionIds,
  getTaskSection,
  removeBulletPoints,
  sortTasksByDate,
  sortTasksBySection
} from './utils/tasks';
import ProjectTask from './projectTask';
import getHtml from './utils/convertMarkdown';

import type { Section, Task } from '@doist/todoist-api-typescript';

export type Task_With_Section_Data = Task & {
  section: Section;
}

const Project = () => {
  const [name, setName] = React.useState('Untitled Project');
  const [tasks, setTasks] = React.useState([]);
  const [sort, setSort] = React.useState<'Date' | 'Section'>('Date')
  const [maxTasks, setMaxTasks] = React.useState(15);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);

  React.useEffect(() => {
    const fetchData = async () => {
      const projectName = await getProjectName();
      const projectTasks = await getProjectTasks();
      const sectionIds = getSectionIds(projectTasks);
      const projectSections = await getProjectSections(sectionIds);
      let i = 0;
      while (i < projectTasks.length) {
        projectTasks[i].content = await getHtml(
          removeBulletPoints(projectTasks[i].content)
        );
        projectTasks[i].description = await getHtml(
          projectTasks[i].description
        )
        projectTasks[i].section = getTaskSection(
          projectSections, projectTasks[i].sectionId
        )
        i += 1;
      }
      setName(projectName);
      setTasks(sortTasksByDate(projectTasks));
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    setLastPage(Math.ceil(tasks.length / maxTasks))
  }, [tasks, maxTasks])

  const handleButton = () => {
    if (sort === 'Section') {
      setSort('Date')
      setTasks(sortTasksByDate(tasks))
      setCurrentPage(1);
      return;
    }

    if (sort === 'Date') {
      setSort('Section')
      setTasks(sortTasksBySection(tasks))
      setCurrentPage(1);
      return;
    }
  }

  return (
    <main>
      <h1>{name} Tasks</h1>
      <p><button type="button" onClick={() => handleButton()}>View By {sort === 'Date' ? 'Section' : 'Date'}</button></p>
      <p>Total tasks: {tasks?.length ?? 0}</p>
      {tasks?.length > 0 ?
        <>
          <p>
            <button type="button" onClick={() => setMaxTasks(15)}>15</button>
            <button type="button" onClick={() => setMaxTasks(25)}>25</button>
            <button type="button" onClick={() => setMaxTasks(50)}>50</button>
          </p>
          <p>
            <button type="button" onClick={() => setCurrentPage(1)} disabled={currentPage === 1 ? true : false}>First</button>
            <button type="button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1 ? true : false}>Previous</button>
            Page {currentPage} of {lastPage}
            <button type="button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === lastPage ? true : false}>Next</button>
            <button type="button" onClick={() => setCurrentPage(lastPage)} disabled={currentPage === lastPage ? true : false}>Last</button>
          </p>
        </>
        :
        <p>No tasks to view</p>
      }
      {tasks.slice(
        maxTasks * currentPage - maxTasks,
        maxTasks * currentPage
        ).map((task, i, arr) => {
        return (
          <React.Fragment key={task?.id}>
            {
              sort === 'Date'
              && task?.due?.date !== arr[i - 1]?.due?.date
              && <h2>{task?.due?.string}</h2>
            }
            {
              sort === 'Section'
              && task?.section?.name !== arr[i - 1]?.section?.name
              && <h2>{task?.section?.name}</h2>
            }
            <ProjectTask {...task} />
          </React.Fragment>
        )
      })}
    </main>
  );
}

export default Project;
