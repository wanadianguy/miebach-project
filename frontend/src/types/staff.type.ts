import type { Project } from "./project.type";
import type { User } from "./user.type";

export type Staff = {
  id: string;
  roleName: string;
  hourlyRate: number;
  forecastedHours: number;
  project: Project;
  user: User;
};
