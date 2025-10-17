import type { Project } from "../../types/project.type";

export type ProjectCardProps = {
  project: Project;
  onOpen: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
};
