import type { Task } from "./task.type";
import type { User } from "./user.type";

export type Assignment = {
  id: string;
  hourlyRate: number;
  task?: Task;
  user?: User;
};
