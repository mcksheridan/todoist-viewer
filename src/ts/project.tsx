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
import LoadingScreen from "./components/loadingScreen";

const Project = () => {
  const [name, setName] = React.useState("Untitled Project");
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = React.useState<
    Task_With_Section_Data[]
  >([]);
  const [sections, setSections] = React.useState<Section[]>([]);
  const [inputSections, setInputSections] = React.useState<Section[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);
  const [inputLabels, setInputLabels] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<"Date" | "Section">("Date");
  const [maxTasks, setMaxTasks] = React.useState(15);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const [loadingHeading, setLoadingHeading] = React.useState("Loading");
  const [loadingMessage, setLoadingMessage] = React.useState(
    "Fetching data from Todoist"
  );
  const [hasError, setHasError] = React.useState(false);
  const DEFAULT_FILTER_INPUT = "";
  const [sectionInput, setSectionInput] = React.useState(DEFAULT_FILTER_INPUT);
  const [labelInput, setLabelInput] = React.useState(DEFAULT_FILTER_INPUT);
  const view = React.useRef<HTMLDivElement>(null);
  const main = React.useRef<HTMLDivElement>(null);

  const throwError = (message?: string) => {
    setDataLoaded(false);
    setHasError(true);
    setLoadingHeading("error");
    setLoadingMessage(message ?? "An error occurred");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
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
          );
          if (projectTasks[i].sectionId) {
            (projectTasks as Task_With_Section_Data[])[i].section =
              getTaskSection(projectSections, projectTasks[i].sectionId);
          }
          i += 1;
        }
        setName(projectName);
        setSections(projectSections);
        setInputSections(projectSections);
        setTasks(sortTasksByDate(projectTasks));
        setFilteredTasks(sortTasksByDate(projectTasks));
        setDataLoaded(true);
      } catch (error) {
        throwError(error?.message);
        console.error(error);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    setLastPage(Math.ceil(filteredTasks.length / maxTasks));
    setCurrentPage(1);
  }, [filteredTasks, maxTasks]);

  React.useEffect(() => {
    setLabels(getTaskLabels(filteredTasks));
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

    const removeMenuEventListeners = () => {
      removeEventListener("mousedown", handleMousedown);
      removeEventListener("keydown", handleKeydown);
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
        removeMenuEventListeners();
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideViewMenu();
        removeMenuEventListeners();
      }
    };

    showViewMenu();
    addEventListener("mousedown", handleMousedown);
    addEventListener("keydown", handleKeydown);
  };

  const handleSort = () => {
    if (sort === "Section") {
      setSort("Date");
      setFilteredTasks(sortTasksByDate(filteredTasks));
      setCurrentPage(1);
      return;
    }

    if (sort === "Date") {
      setSort("Section");
      setFilteredTasks(sortTasksBySection(filteredTasks));
      setCurrentPage(1);
      return;
    }
  };

  const filterTasksBySection = (id: string) => {
    if (id === DEFAULT_FILTER_INPUT) {
      setFilteredTasks(tasks);
      return;
    }

    setInputSections(inputSections.filter((section) => section.id === id));

    setFilteredTasks(
      filteredTasks.filter((task) => {
        return task?.section?.id === id;
      })
    );
  };

  React.useEffect(() => {
    filterTasksBySection(sectionInput);
  }, [sectionInput]);

  const resetFilters = () => {
    setSectionInput(DEFAULT_FILTER_INPUT);
    setLabelInput(DEFAULT_FILTER_INPUT);
    setInputSections(sections);
    setInputLabels([]);
  };

  const filterTasksByLabel = (inputLabel: string) => {
    if (inputLabel === DEFAULT_FILTER_INPUT) {
      setFilteredTasks(tasks);
      return;
    }

    setInputLabels([...inputLabels, inputLabel]);

    setFilteredTasks(
      filteredTasks.filter((task) => {
        return [...inputLabels, inputLabel].every((label) => {
          return task.labels.includes(label);
        });
      })
    );
  };

  React.useEffect(() => {
    filterTasksByLabel(labelInput);
  }, [labelInput]);

  const handleTopButton = () => {
    main.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main ref={main} className="main">
      {dataLoaded ? (
        <>
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
              disabled={tasks?.length < 1}
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
                  action={() => resetFilters()}
                  image={resetIcon.src}
                  text="Reset filters"
                />
              </li>
              <li>
                <label className="label-with-icon">
                  <TextWithIcon image={sectionIcon.src} text="Section" />
                  <select
                    className="label-with-icon__select"
                    value={sectionInput}
                    onChange={(event) => setSectionInput(event.target.value)}
                  >
                    <option value={DEFAULT_FILTER_INPUT} disabled></option>
                    {inputSections
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
                    value={labelInput}
                    onChange={(event) => setLabelInput(event.target.value)}
                  >
                    <option disabled value={DEFAULT_FILTER_INPUT}></option>
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
        </>
      ) : (
        <LoadingScreen
          heading={loadingHeading}
          message={loadingMessage}
          hasAnimation={!hasError}
        />
      )}
    </main>
  );
};

export default Project;
