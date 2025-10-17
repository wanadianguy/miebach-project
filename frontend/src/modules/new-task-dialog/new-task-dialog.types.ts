import type { Phase } from "../../types/phase.type";
import type { Project } from "../../types/project.type";

export type NewTaskDialogProps = {
  project: Project;
  open: boolean;
  onClose: () => void;
  onSave: (phase: Phase) => void;
};
