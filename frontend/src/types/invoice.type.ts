import type { Project } from "./project.type";

export type Invoice = {
  id: string;
  clientName: string;
  startDate: string;
  endDate: string;
  amount: number;
  project?: Project;
};
