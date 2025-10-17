import type { Project } from "../../types/project.type";
import type { Staff } from "../../types/staff.type";
import type { User } from "../../types/user.type";

export type NewStaffDialogProps = {
  project: Project;
  users: User[];
  open: boolean;
  onClose: () => void;
  onSave: (staff: Staff) => void;
};
