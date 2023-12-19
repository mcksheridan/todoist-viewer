import { TodoistApi } from "@doist/todoist-api-typescript"

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

export { getProjectName, getProjectTasks }
