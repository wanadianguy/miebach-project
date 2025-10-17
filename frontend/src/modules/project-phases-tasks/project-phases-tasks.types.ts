import type { Project } from "../../types/project.type";

export type ProjectPhasesTasksProps = {
  project: Project;
  onSave: (project: Project) => void;
};
