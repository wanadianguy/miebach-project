import type { Task } from "../../types/task.type";

export type TimeLoggingDialogProps = {
  task: Task;
  open: boolean;
  onClose: () => void;
};
