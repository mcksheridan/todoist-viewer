import * as React from 'react';
import { getProjectName, getProjectSections, getProjectTasks } from './utils/todoist';
import {
  getSectionIds,
  getTaskLabels,
  getTaskSection,
  removeBulletPoints,
  sortTasksByDate,
  sortTasksBySection
} from './utils/tasks';
import ProjectTask from './projectTask';
import getHtml from './utils/convertMarkdown';
import TasksPerPage from './cmp/tasksPerPage';
import DateIcon from '../assets/img/icon__date.png';
import LabelIcon from '../assets/img/icon__label.png';
import SectionIcon from '../assets/img/icon__section.png';

import type { Section, Task } from '@doist/todoist-api-typescript';

export type Task_With_Section_Data = Task & {
  section: Section;
}

const dateIcon = new Image();
dateIcon.src = DateIcon;
const labelIcon = new Image();
labelIcon.src = LabelIcon;
const sectionIcon = new Image();
sectionIcon.src = SectionIcon;

const Project = () => {
  const [name, setName] = React.useState('Untitled Project');
  const [tasks, setTasks] = React.useState([]);
  const [filteredTasks, setFilteredTasks] = React.useState([]);
  const [sections, setSections] = React.useState([]);
  const [labels, setLabels] = React.useState<string[]>([]);
  const [inputLabels, setInputLabels] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<'Date' | 'Section'>('Date')
  const [maxTasks, setMaxTasks] = React.useState(15);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const view = React.useRef<HTMLDivElement>(null)
  const main = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      const projectName = await getProjectName();
      const projectTasks = await getProjectTasks();
      let i = 0;
      while (i < projectTasks.length) {
        projectTasks[i].content = await getHtml(
          removeBulletPoints(projectTasks[i].content)
        );
        projectTasks[i].description = await getHtml(
          projectTasks[i].description
        )
        i += 1;
      }
      setName(projectName);
      setTasks(sortTasksByDate(projectTasks));
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    setFilteredTasks(tasks)
  }, [tasks])

  React.useEffect(() => {
    setLastPage(Math.ceil(filteredTasks.length / maxTasks))
  }, [filteredTasks, maxTasks])

  React.useEffect(() => {
    setLabels(getTaskLabels(filteredTasks))
  }, [filteredTasks])

  React.useEffect(() => {
    (async () => {
      const sectionIds = getSectionIds(filteredTasks);
      const projectSections = await getProjectSections(sectionIds);
      setSections(projectSections);
      let i = 0;
      while (i < filteredTasks.length) {
        filteredTasks[i].section = getTaskSection(
          projectSections, filteredTasks[i].sectionId
        )
        i += 1;
      }
    })()
  }, [filteredTasks])

  const handleViewMenu = () => {
    const showViewMenu = () => {
      view.current.classList.add('view--visible');
      main.current.classList.add('main--frozen');
    }

    const hideViewMenu = () => {
      view.current.classList.remove('view--visible');
      main.current.classList.remove('main--frozen');
    }

    const handleMousedown = (event: MouseEvent) => {
      const viewCoordinates = view.current.getBoundingClientRect();
      const viewXSpace = viewCoordinates.x + viewCoordinates.width;
      const viewYSpace = viewCoordinates.y + viewCoordinates.height;
      if (
        !(viewCoordinates.x <= event.x && event.x <= viewXSpace) ||
        !(viewCoordinates.y <= event.y && event.y <= viewYSpace)
      ) {
        hideViewMenu();
        removeEventListener('mousedown', handleMousedown);
      }
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideViewMenu();
        removeEventListener('keydown', handleKeydown);
      }
    }

    showViewMenu();
    addEventListener('mousedown', handleMousedown);
    addEventListener('keydown', handleKeydown);
  }

  const handleSort = () => {
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

  const filterTasksBySection = (id: string) => {
    setFilteredTasks(filteredTasks.filter((task) => {
      return task.section.id === id
    }))
  }

  const filterTasksByLabel = (inputLabel: string) => {
    setInputLabels([...inputLabels, inputLabel])
    setFilteredTasks(filteredTasks.filter((task) => {
      return [...inputLabels, inputLabel].every((label) => {
        return task.labels.includes(label)
      })
    }))
  }

  return (
    <main ref={main} className="main">
      <h1 className="heading">{name} Tasks</h1>
      <p className="description">
        <span>
          {tasks?.length} tasks ({tasks?.length - filteredTasks.length ?? 0}{" "}
          hidden)
        </span>
        <button
          type="button"
          onClick={() => handleViewMenu()}
          disabled={filteredTasks?.length < 1 ? true : false}
        >
          View
        </button>
      </p>
      <div className="view" ref={view}>
        <h2 className="subheading">View</h2>
        <TasksPerPage
          action={setMaxTasks}
          taskNumbers={[25, 15, 50]}
          totalTasks={filteredTasks.length}
        />
        <h3 className="subheading">Sort by</h3>
        <div className="sort-by">
          <button
            type="button"
            className="sort-by__button"
            disabled={sort === "Date"}
            onClick={() => handleSort()}
          >
            <img src={dateIcon.src} alt="" /> Date
          </button>
          <button
            type="button"
            className="sort-by__button"
            disabled={sort === "Section"}
            onClick={() => handleSort()}
          >
            <img src={sectionIcon.src} alt="" /> Section
          </button>
        </div>
        <h3>Filter by</h3>
        <ul>
          <li>
            <button type="button" onClick={() => setFilteredTasks(tasks)}>
              Reset Filters
            </button>
          </li>
          <li>
            <label className="label-with-icon">
              <span>
                <img src={sectionIcon.src} alt="" />
                Section
              </span>
              <select>
                {sections
                  .sort((a, b) => {
                    return b?.order - a?.order;
                  })
                  .map((section) => {
                    return (
                      <option
                        key={section?.id}
                        onClick={() => filterTasksBySection(section?.id)}
                      >
                        {section?.name}
                      </option>
                    );
                  })}
              </select>
            </label>
          </li>
          <li>
            <label className="label-with-icon">
              <span>
                <img src={labelIcon.src} alt="" />
                Label
              </span>
              <select>
                {labels
                  .sort((a, b) => {
                    const labelA = a.toLowerCase();
                    const labelB = b.toLowerCase();

                    if (labelA > labelB) {
                      return 1;
                    }

                    if (labelA < labelB) {
                      return -1;
                    }

                    return;
                  })
                  .map((label) => {
                    return (
                      <option
                        key={label}
                        onClick={() => filterTasksByLabel(label)}
                      >
                        {label}
                      </option>
                    );
                  })}
              </select>
            </label>
          </li>
        </ul>
      </div>
      <p>
        <button
          type="button"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1 ? true : false}
        >
          First
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1 ? true : false}
        >
          Previous
        </button>
        Page {currentPage} of {lastPage}
        <button
          type="button"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === lastPage ? true : false}
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage(lastPage)}
          disabled={currentPage === lastPage ? true : false}
        >
          Last
        </button>
      </p>
      {filteredTasks
        .slice(maxTasks * currentPage - maxTasks, maxTasks * currentPage)
        .map((task, i, arr) => {
          return (
            <React.Fragment key={task?.id}>
              {sort === "Date" && task?.due?.date !== arr[i - 1]?.due?.date && (
                <h2>{task?.due?.string}</h2>
              )}
              {sort === "Section" &&
                task?.section?.name !== arr[i - 1]?.section?.name && (
                  <h2>{task?.section?.name}</h2>
                )}
              <ProjectTask {...task} />
            </React.Fragment>
          );
        })}
    </main>
  );
}

export default Project;
