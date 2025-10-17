import type { Project } from "../../types/project.type";

export type NewTaskDialogProps = {
  project: Project;
  open: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
};
