//Not ready
import { useState } from "react";
import type { ReportsProps } from "./reports.types";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { BudgetReport } from "../budget-report/budget-report";

export const Reports = ({ projects }: ReportsProps) => {
    const [selectedProject, setSelectedProject] = useState<number | string>("");

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Budget & Utilization Reports
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Project</InputLabel>
                <Select
                    value={selectedProject}
                    onChange={(event) => setSelectedProject(event.target.value)}
                    label="Select Project"
                >
                    {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                            {project.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedProject && (
                <BudgetReport
                    project={projects.find(
                        (project) => project.id === selectedProject,
                    )}
                />
            )}
        </Box>
    );
};
