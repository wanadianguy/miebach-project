import type { TimeEntry } from "./time-entry.type";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "manager" | "contributor";
  timeEntries?: TimeEntry[];
};
