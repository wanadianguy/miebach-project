import type { Task } from "./task.type";
import type { User } from "./user.type";

export type TimeEntry = {
  id: string;
  workDate: string;
  hours: number;
  isBillable: boolean;
  user?: User;
  task?: Task;
};
