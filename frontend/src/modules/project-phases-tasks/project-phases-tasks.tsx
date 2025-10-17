import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Paper,
    Typography,
} from "@mui/material";
import type { ProjectPhasesTasksProps } from "./project-phases-tasks.types";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { NewPhaseDialog } from "../new-phase-dialog/new-phase-dialog";
import type { Phase } from "../../types/phase.type";
import { NewTaskDialog } from "../new-task-dialog/new-task-dialog";

export const ProjectPhasesTasks = ({
    project,
    onSave,
}: ProjectPhasesTasksProps) => {
    const [newPhaseOpen, setNewPhaseOpen] = useState(false);
    const [newTaskOpen, setNewTaskOpen] = useState(false);

    return (
        <Box>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                {project.status === "planned" && (
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => setNewPhaseOpen(true)}
                    >
                        Add Phase
                    </Button>
                )}
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setNewTaskOpen(true)}
                >
                    Add Task
                </Button>
            </Box>

            {project.phases.map((phase) => (
                <Card key={phase.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{phase.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {phase.startDate} - {phase.endDate}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <Chip
                                label={phase.status}
                                size="small"
                                sx={{ mr: 1 }}
                            />
                            <Chip
                                label={`Budget: $${phase.budget}`}
                                size="small"
                                variant="outlined"
                            />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            {phase.tasks &&
                                phase.tasks.map((task) => (
                                    <Paper key={task.id} sx={{ p: 2, mb: 1 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1">
                                                    {task.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {task.description}
                                                </Typography>
                                                <Box sx={{ mt: 1 }}>
                                                    <Chip
                                                        label={task.status}
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    />
                                                    <Chip
                                                        label={`Budget: $${task.budget}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Box>
                                            <Box sx={{ textAlign: "right" }}>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {task.startDate}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    display="block"
                                                    color="text.secondary"
                                                >
                                                    {task.endDate}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                        </Box>
                    </CardContent>
                </Card>
            ))}
            <NewPhaseDialog
                project={project}
                open={newPhaseOpen}
                onClose={() => setNewPhaseOpen(false)}
                onSave={(phase: Phase) => {
                    project.phases.push(phase);
                    onSave(project);
                }}
            />
            <NewTaskDialog
                project={project}
                open={newTaskOpen}
                onClose={() => setNewTaskOpen(false)}
                onSave={(phase: Phase) => {
                    project.phases.push(phase);
                    onSave(project);
                }}
            />
        </Box>
    );
};
