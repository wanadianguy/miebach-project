import type { Project } from "../../types/project.type";

export type NewProjectDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
};
