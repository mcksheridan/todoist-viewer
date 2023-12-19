import * as React from 'react';
import '../scss/base.scss';
import { createRoot } from 'react-dom/client';
import { getProjectName, getProjectTasks } from './todoist';
import getHtml from './convertMarkdown';

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById('app'));

const App = () => {
  const [name, setName] = React.useState('Untitled Project');
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const projectName = await getProjectName();
      const projectTasks = await getProjectTasks();
      let i = 0;
      while (i < projectTasks.length) {
        projectTasks[i].content = await getHtml(projectTasks[i].content)
        i += 1;
      }
      setName(projectName);
      setTasks(projectTasks);
    }
    fetchData();
  }, []);

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
