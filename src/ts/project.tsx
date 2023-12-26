import * as React from "react";
import {
  getProjectName,
  getProjectSections,
  getProjectTasks,
} from "./utilities/todoist";
import {
  getSectionIds,
  getTaskLabels,
  getTaskSection,
  removeBulletPoints,
  sortTasksByDate,
  sortTasksBySection,
} from "./utilities/tasks";
import {
  backIcon,
  checkmarkIcon,
  dateIcon,
  firstIcon,
  labelIcon,
  lastIcon,
  nextIcon,
  resetIcon,
  sectionIcon,
  sliderIcon,
  upIcon,
} from "./utilities/images";
import ButtonWithIcon from "./components/buttonWithIcon";
import getHtml from "./utilities/convertMarkdown";
import ProjectTask from "./components/projectTask";
import TasksPerPage from "./components/tasksPerPage";
import TextWithIcon from "./components/textWithIcon";

import type { Section, Task } from "@doist/todoist-api-typescript";
import type { Task_With_Section_Data } from "./types";

const Project = () => {
  const [name, setName] = React.useState("Untitled Project");
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = React.useState<
    Task_With_Section_Data[]
  >([]);
  const [sections, setSections] = React.useState<Section[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);
  const [inputLabels, setInputLabels] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<"Date" | "Section">("Date");
  const [maxTasks, setMaxTasks] = React.useState(15);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const view = React.useRef<HTMLDivElement>(null);
  const main = React.useRef<HTMLDivElement>(null);

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
        );
        i += 1;
      }
      setName(projectName);
      setTasks(sortTasksByDate(projectTasks));
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  React.useEffect(() => {
    setLastPage(Math.ceil(filteredTasks.length / maxTasks));
  }, [filteredTasks, maxTasks]);

  React.useEffect(() => {
    setLabels(getTaskLabels(filteredTasks));
  }, [filteredTasks]);

  React.useEffect(() => {
    (async () => {
      const sectionIds = getSectionIds(filteredTasks);
      const projectSections = await getProjectSections(sectionIds);
      setSections(projectSections);
      let i = 0;
      while (i < filteredTasks.length) {
        filteredTasks[i].section = getTaskSection(
          projectSections,
          filteredTasks[i].sectionId
        );
        i += 1;
      }
    })();
  }, [filteredTasks]);

  const handleViewMenu = () => {
    const showViewMenu = () => {
      view.current.classList.add("view--visible");
      main.current.classList.add("main--frozen");
    };

    const hideViewMenu = () => {
      view.current.classList.remove("view--visible");
      main.current.classList.remove("main--frozen");
    };

    const handleMousedown = (event: MouseEvent) => {
      const viewCoordinates = view.current.getBoundingClientRect();
      const viewXSpace = viewCoordinates.x + viewCoordinates.width;
      const viewYSpace = viewCoordinates.y + viewCoordinates.height;
      if (
        !(viewCoordinates.x <= event.x && event.x <= viewXSpace) ||
        !(viewCoordinates.y <= event.y && event.y <= viewYSpace)
      ) {
        hideViewMenu();
        removeEventListener("mousedown", handleMousedown);
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideViewMenu();
        removeEventListener("keydown", handleKeydown);
      }
    };

    showViewMenu();
    addEventListener("mousedown", handleMousedown);
    addEventListener("keydown", handleKeydown);
  };

  const handleSort = () => {
    if (sort === "Section") {
      setSort("Date");
      setTasks(sortTasksByDate(tasks));
      setCurrentPage(1);
      return;
    }

    if (sort === "Date") {
      setSort("Section");
      setTasks(sortTasksBySection(tasks));
      setCurrentPage(1);
      return;
    }
  };

  const filterTasksBySection = (id: string) => {
    setFilteredTasks(
      filteredTasks.filter((task) => {
        return task.section.id === id;
      })
    );
  };

  const filterTasksByLabel = (inputLabel: string) => {
    setInputLabels([...inputLabels, inputLabel]);
    setFilteredTasks(
      filteredTasks.filter((task) => {
        return [...inputLabels, inputLabel].every((label) => {
          return task.labels.includes(label);
        });
      })
    );
  };

  const handleTopButton = () => {
    main.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main ref={main} className="main">
      <h1 className="heading">{name} Tasks</h1>
      <div className="subheading-text spaced-container">
        <TextWithIcon
          image={checkmarkIcon.src}
          text={`${tasks?.length} tasks (${
            tasks?.length - filteredTasks.length ?? 0
          } hidden)`}
        />
        <ButtonWithIcon
          action={() => handleViewMenu()}
          disabled={filteredTasks?.length < 1}
          image={sliderIcon.src}
          text="View"
          toggleTextDisplay
        />
      </div>
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
        <h3 className="subheading">Filter by</h3>
        <ul>
          <li className="subheading-text">
            <ButtonWithIcon
              action={() => setFilteredTasks(tasks)}
              image={resetIcon.src}
              text="Reset filters"
            />
          </li>
          <li>
            <label className="label-with-icon">
              <TextWithIcon image={sectionIcon.src} text="Section" />
              <select
                className="label-with-icon__select"
                onChange={(event) => filterTasksBySection(event.target.value)}
              >
                {sections
                  .sort((a, b) => {
                    return b?.order - a?.order;
                  })
                  .map((section) => {
                    return (
                      <option key={section?.id} value={section?.id}>
                        {section?.name}
                      </option>
                    );
                  })}
              </select>
            </label>
          </li>
          <li>
            <label className="label-with-icon">
              <TextWithIcon image={labelIcon.src} text="Label" />
              <select
                className="label-with-icon__select"
                onChange={(event) => filterTasksByLabel(event.target.value)}
              >
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
                      <option key={label} value={label}>
                        {label}
                      </option>
                    );
                  })}
              </select>
            </label>
          </li>
        </ul>
      </div>
      <div className="page-container">
        <ButtonWithIcon
          action={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          image={firstIcon.src}
          text="first"
          toggleTextDisplay
        />
        <ButtonWithIcon
          action={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          image={backIcon.src}
          text="back"
          toggleTextDisplay
        />
        <span className="page-container__current-page">
          {currentPage} / {lastPage}
        </span>
        <ButtonWithIcon
          action={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === lastPage}
          image={nextIcon.src}
          text="next"
          textBeforeIcon
          toggleTextDisplay
        />
        <ButtonWithIcon
          action={() => setCurrentPage(lastPage)}
          disabled={currentPage === lastPage}
          image={lastIcon.src}
          text="last"
          textBeforeIcon
          toggleTextDisplay
        />
      </div>
      {filteredTasks
        .slice(maxTasks * currentPage - maxTasks, maxTasks * currentPage)
        .map((task: Task_With_Section_Data) => (
          <ProjectTask {...task} key={task.id} />
        ))}
      <span className="subheading-text">
        <ButtonWithIcon
          action={() => handleTopButton()}
          image={upIcon.src}
          text="back to top"
        />
      </span>
    </main>
  );
};

export default Project;
