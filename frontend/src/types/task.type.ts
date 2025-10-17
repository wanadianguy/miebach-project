import type { Assignment } from "./assignment.type";
import type { Phase } from "./phase.type";
import type { TimeEntry } from "./time-entry.type";

export type Task = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "planned" | "in progress" | "done";
  budget: number;
  assignments?: Assignment[];
  phase?: Phase;
  timeEntries?: TimeEntry[];
};
