import type { Project } from "./project.type";
import type { Task } from "./task.type";

export type Phase = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: "planned" | "in progress" | "done";
  project?: Project;
  tasks?: Task[];
};
