import type { Task } from "../../types/task.type";

export type NewAssignmentDialogProps = {
  userId: string;
  tasks: Task[];
  open: boolean;
  onClose: () => void;
};
