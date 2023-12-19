import * as React from 'react';
import '../scss/base.scss';
import { createRoot } from 'react-dom/client';
import { getProjectName, getProjectSections, getProjectTasks } from './todoist';
import ProjectTask from './projectTask';
import getHtml from './convertMarkdown';

import type { Section, Task } from '@doist/todoist-api-typescript';

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById('app'));

const App = () => {
  const [name, setName] = React.useState('Untitled Project');
  const [tasks, setTasks] = React.useState([]);
  const [sections, setSections] = React.useState([]);

  const getSectionIds = (tasks: Task[]) => {
    const allSectionIds = tasks.map((task) => task.sectionId);
    const uniqueSectionIds = allSectionIds.filter((id, i, arr) => arr.indexOf(id) === i);
    return uniqueSectionIds;
  }

  const removeBulletPoints = (string: string) => {
    if (string.startsWith('* ')) {
      return string.slice(2);
    }
    return string;
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const projectName = await getProjectName();
      const projectTasks = await getProjectTasks();
      let i = 0;
      while (i < projectTasks.length) {
        projectTasks[i].content = await getHtml(
          removeBulletPoints(projectTasks[i].content)
        );
        i += 1;
      }
      setName(projectName);
      setTasks(projectTasks);
      const sectionIds = getSectionIds(projectTasks);
      const projectSections = await getProjectSections(sectionIds);
      setSections(projectSections);
    }
    fetchData();
  }, []);

  const getTaskSection = (sections: Section[], taskSectionId: string) => {
    const resultArr = sections.filter((section) => {
      return section?.id === taskSectionId
    });
    const result = resultArr[0];
    return result;
  }

  return (
    <>
      <h1>{name} Tasks</h1>
      <ul>
        {tasks.map((task) => <li key={task?.id}>{task?.content}</li>)}
      </ul>
    </>
  );
}

root.render(<App />);
