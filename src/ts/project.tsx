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
  const [buttonText, setButtonText] = React.useState('Section');

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
      setTasks(projectTasks);
    }
    fetchData();
  }, []);

  const handleButton = () => {
    if (buttonText === 'Section') {
      setButtonText('Date');
      setTasks(sortTasksBySection(tasks))
      return;
    } else {
      setButtonText('Section');
      setTasks(sortTasksByDate(tasks))
      return;
    }
  }

  return (
    <main>
      <h1>{name} Tasks</h1>
      <p><button type="button" onClick={() => handleButton()}>View By {buttonText}</button></p>
      {tasks.slice(0, 15).map((task) => {
        return (
          <ProjectTask
            key={task?.id}
            {...task}
          />
        )
      })}
    </main>
  );
}

export default Project;
