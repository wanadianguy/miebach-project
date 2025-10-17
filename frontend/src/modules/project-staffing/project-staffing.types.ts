import type { Project } from "../../types/project.type";

export type ProjectStaffingProps = {
  project: Project;
  onSave: (project: Project) => void;
};
