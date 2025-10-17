import type { Project } from "../../types/project.type";

export type NewPhaseDialogProps = {
  project: Project;
  open: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
};
