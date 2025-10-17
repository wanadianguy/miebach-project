import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import type { ContributorDashboardProps } from "./contributor-dashboard.types";
import { AccessTime, Logout } from "@mui/icons-material";
import { useEffect, useState } from "react";
import type { Task } from "../../types/task.type";
import { TimeLoggingDialog } from "../time-logging-dialogue/time-logging-dialogue";
import type { Assignment } from "../../types/assignment.type";

export const ContributorDashboard = ({
    onLogout,
    onNavigate,
}: ContributorDashboardProps) => {
    const userId = localStorage.getItem("id");
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task>();

    useEffect(() => {
        fetch(`http://localhost:3001/assignments/user/${userId}`, {
            method: "GET",
            mode: "cors",
        })
            .then((response) => {
                return response.json();
            })
            .then((data: Assignment[]) => {
                setAssignments(data);
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Contributor Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={onLogout}>
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Assigned Tasks
                </Typography>

                <Grid container spacing={2}>
                    {assignments.map((assignment) => {
                        return (
                            <Card>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1,
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {assignment.task?.title}
                                        </Typography>
                                        <Chip
                                            label={assignment.task?.status}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        {assignment.task?.description}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                        >
                                            Project:{" "}
                                            {
                                                assignment.task?.phase?.project
                                                    ?.name
                                            }
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                        >
                                            Phase:{" "}
                                            {assignment.task?.phase?.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                        >
                                            Due: {assignment.task?.endDate}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            mt: 2,
                                            display: "flex",
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<AccessTime />}
                                            onClick={() =>
                                                setSelectedTask(assignment.task)
                                            }
                                        >
                                            Log Hours
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Grid>
            </Container>

            {selectedTask && (
                <TimeLoggingDialog
                    task={selectedTask}
                    open={!!selectedTask}
                    onClose={() => setSelectedTask(undefined)}
                />
            )}
        </Box>
    );
};
