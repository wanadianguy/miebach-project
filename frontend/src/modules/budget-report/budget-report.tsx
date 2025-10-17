//Not ready
import {
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import type { BudgetReportProps } from "./budget-report.types";
import type { Task } from "../../types/task.type";

export const BudgetReport = ({ project }: BudgetReportProps) => {
    const calculateTaskBudget = (task: Task) => {
        let actual = 0;
        task.time_entries.forEach((entry) => {
            const assignment = task.assignments.find(
                (a) => a.user_id === entry.user_id,
            );
            if (assignment) {
                actual += entry.hours * assignment.hourly_rate;
            }
        });
        return { budget: task.budget, actual, remaining: task.budget - actual };
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Phase</TableCell>
                        <TableCell>Task</TableCell>
                        <TableCell align="right">Budget</TableCell>
                        <TableCell align="right">Actual</TableCell>
                        <TableCell align="right">Remaining</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {project?.phases.map((phase) =>
                        phase.tasks.map((task) => {
                            const budget = calculateTaskBudget(task);
                            return (
                                <TableRow key={task.id}>
                                    <TableCell>{phase.name}</TableCell>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell align="right">
                                        ${budget.budget}
                                    </TableCell>
                                    <TableCell align="right">
                                        ${budget.actual.toFixed(2)}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            color:
                                                budget.remaining < 0
                                                    ? "error.main"
                                                    : "success.main",
                                        }}
                                    >
                                        ${budget.remaining.toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            label={task.status}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        }),
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
