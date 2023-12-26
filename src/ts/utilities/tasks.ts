import type { Task, Section } from "@doist/todoist-api-typescript";
import type { Task_With_Section_Data } from "../types";

const getSectionIds = (tasks: Task[]): string[] => {
  const allSectionIds = tasks.map((task) => task.sectionId);
  const uniqueSectionIds = allSectionIds.filter(
    (id, i, arr) => arr.indexOf(id) === i
  );
  return uniqueSectionIds;
};

const getTaskLabels = (tasks: Task[]): string[] => {
  const labels: string[] = [];
  tasks.forEach((task) => {
    const newLabels = task.labels.filter((label) => !labels.includes(label));
    newLabels.forEach((newLabel) => labels.push(newLabel));
  });
  return labels;
};

const getTaskSection = (
  sections: Section[],
  taskSectionId: string
): Section => {
  const resultArr = sections.filter((section) => {
    return section?.id === taskSectionId;
  });
  const result = resultArr[0];
  return result;
};

const removeBulletPoints = (string: string): string => {
  if (string.startsWith("* ")) {
    return string.slice(2);
  }
  return string;
};

const sortTasksByDate = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    const dateA = new Date(a?.due?.datetime ?? a?.due?.date);
    const dateB = new Date(b?.due?.datetime ?? b?.due?.date);
    if (dateA > dateB) {
      return 1;
    } else if (dateA < dateB) {
      return -1;
    } else {
      return 0;
    }
  });
};

const sortTasksBySection = (
  tasks: Task_With_Section_Data[]
): Task_With_Section_Data[] => {
  return tasks.sort((a, b) => {
    if (a?.section?.order > b?.section?.order) {
      return -1;
    } else if (a?.section?.order < b?.section?.order) {
      return 1;
    } else {
      return 0;
    }
  });
};

export {
  getSectionIds,
  getTaskLabels,
  getTaskSection,
  removeBulletPoints,
  sortTasksByDate,
  sortTasksBySection,
};
