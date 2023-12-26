import type { Task, Section } from "@doist/todoist-api-typescript";

type Button_With_Icon = {
  action: () => void;
  disabled?: boolean;
  image: string;
  text: string;
  textBeforeIcon?: boolean;
};

type Tasks_Per_Page_type = {
  action: (value: React.SetStateAction<number>) => void;
  taskNumbers: number[];
  totalTasks: number;
};

type Task_With_Section_Data = Task & {
  section: Section;
};

type Text_With_Icon = {
  elementType?: "time" | "li";
  hasWarning?: boolean;
  image: string;
  text: string;
};

export {
  Button_With_Icon,
  Tasks_Per_Page_type,
  Task_With_Section_Data,
  Text_With_Icon,
};
