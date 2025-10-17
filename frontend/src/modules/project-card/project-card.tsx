import { useState } from "react";
import type { ProjectCardProps } from "./project-card.types";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Collapse,
    IconButton,
    LinearProgress,
    Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export const ProjectCard = ({
    project,
    onOpen,
    onEdit,
    onDelete,
}: ProjectCardProps) => {
    const [expanded, setExpanded] = useState(false);

    const budget = {
        forecast: project.forecastedBudget,
        actual: project.budget,
        remaining: project.forecastedBudget - project.budget,
    };
    const progress =
        budget.forecast > 0 ? (budget.actual / budget.forecast) * 100 : 0;

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{project.name}</Typography>
                        <Chip
                            label={project.status}
                            size="small"
                            sx={{ mr: 1 }}
                        />
                        <Typography color="text.secondary" variant="body2">
                            Client: {project.clientName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {`${project.startDate} - ${project.endDate}`}
                        </Typography>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                        }}
                    >
                        <Typography variant="body2">Budget Progress</Typography>
                        <Typography variant="body2">
                            {progress.toFixed(0)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(progress, 100)}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 1,
                        }}
                    >
                        <Typography variant="caption">
                            ${budget.actual.toFixed(0)} / $
                            {budget.forecast.toFixed(0)}
                        </Typography>
                        <Typography
                            variant="caption"
                            color={
                                budget.remaining < 0 ? "error" : "success.main"
                            }
                        >
                            ${budget.remaining.toFixed(0)} remaining
                        </Typography>
                    </Box>
                </Box>

                <Collapse in={expanded}>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Team
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            {project.staffing.map((staff) => {
                                return (
                                    <Chip
                                        key={staff.id}
                                        label={`${staff.user.name} - ${staff.roleName}`}
                                        size="small"
                                        sx={{ mr: 1, mb: 1 }}
                                    />
                                );
                            })}
                        </Box>

                        <Typography variant="subtitle2" gutterBottom>
                            Phases
                        </Typography>
                        {project.phases.map((phase) => (
                            <Box
                                key={phase.id}
                                sx={{
                                    mb: 2,
                                    pl: 2,
                                    borderLeft: "3px solid #1976d2",
                                }}
                            >
                                <Typography variant="body2" fontWeight="bold">
                                    {phase.name}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {phase.tasks && phase.tasks.length} task(s)
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Collapse>
            </CardContent>

            <CardActions>
                <Button size="small" onClick={() => onOpen(project)}>
                    Open Project
                </Button>
            </CardActions>
        </Card>
    );
};
