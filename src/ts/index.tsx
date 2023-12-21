import * as React from 'react';
import '../scss/base.scss';
import { createRoot } from 'react-dom/client';
import { getProjectName, getProjectSections, getProjectTasks } from './todoist';
import ProjectTask from './projectTask';
import getHtml from './convertMarkdown';

import type { Section, Task } from '@doist/todoist-api-typescript';

export type Task_With_Section_Data = Task & {
  section: Section;
}

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById('app'));

const App = () => {
  const [name, setName] = React.useState('Untitled Project');
  const [tasks, setTasks] = React.useState([]);
  const [buttonText, setButtonText] = React.useState('Section');

  const getSectionIds = (tasks: Task[]) => {
    const allSectionIds = tasks.map((task) => task.sectionId);
    const uniqueSectionIds = allSectionIds.filter((id, i, arr) => arr.indexOf(id) === i);
    return uniqueSectionIds;
  }

  const getTaskSection = (sections: Section[], taskSectionId: string) => {
    const resultArr = sections.filter((section) => {
      return section?.id === taskSectionId
    });
    const result = resultArr[0];
    return result;
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

  const sortTasksByDate = (tasks: Task[]) => {
    return tasks.sort((a, b) => {
      const dateA = new Date(a?.due?.datetime ?? a?.due?.date)
      const dateB = new Date(b?.due?.datetime ?? b?.due?.date)
      if (dateA > dateB) {
        return 1;
      } else if (dateA < dateB) {
        return -1;
      } else {
        return 0;
      }
    })
  }

  const sortTasksBySection = (tasks: Task_With_Section_Data[]) => {
    return tasks.sort((a, b) => {
      if (a?.section?.order > b?.section?.order) {
        return -1;
      } else if (a?.section?.order < b?.section?.order) {
        return 1;
      } else {
        return 0;
      }
    })
  }

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

root.render(<App />);
