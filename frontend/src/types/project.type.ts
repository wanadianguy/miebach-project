import type { Invoice } from "./invoice.type";
import type { Phase } from "./phase.type";
import type { Satff } from "./staff.type";

export type Project = {
  id: string;
  name: string;
  clientName: string;
  startDate: string;
  endDate: string;
  budget: number;
  forecastedBudget: number;
  status: "planned" | "in progress" | "done";
  staffing: Satff[];
  phases: Phase[];
  invoices: Invoice[];
};
