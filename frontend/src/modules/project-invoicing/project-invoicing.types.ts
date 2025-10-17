import type { Project } from "../../types/project.type";

export type ProjectInvoicingProps = {
  project: Project;
};

export type DetailedInvoice = {
  items?: InvoiceItem[];
  total: number;
};

export type InvoiceItem = {
  task: string;
  phase: string;
  hours: number;
  rate: number;
  amount: number;
};
