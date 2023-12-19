import { Section, TodoistApi } from "@doist/todoist-api-typescript"

const api = new TodoistApi(process.env.TODOIST_API)

const getProjectName = async () => {
  try {
    const project = await api.getProject(process.env.PROJECT_ID);
    const projectName = project.name;
    return projectName;
  } catch (error) {
    console.error(error);
  }
}

const getProjectTasks = async () => {
  try {
    const activeTasks = await api.getTasks({projectId: process.env.PROJECT_ID})
    return activeTasks;
  } catch (error) {
    console.log(error);
  }
}

const getProjectSections = async (sectionIds: string[]) => {
  const sections: Section[] = [];
  let i = 0;
  while (i < sectionIds.length) {
    try {
      const section = await api.getSection(sectionIds[i]);
      sections.push(section);
      i += 1;
    } catch (error) {
      console.error(error);
    }
  }
  return sections;
}

export { getProjectName, getProjectTasks, getProjectSections }
