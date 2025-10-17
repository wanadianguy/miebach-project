import { useState, useEffect } from "react";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Typography,
    Card,
    Chip,
    Button,
} from "@mui/material";
import { Add, CalendarToday } from "@mui/icons-material";
import type { User } from "../../types/user.type";
import type { Assignment } from "../../types/assignment.type";
import { NewAssgnmentDialog } from "../new-assignment-dialog/new-assignment-dialog";
import type { Task } from "../../types/task.type";

export const TeamAvailability = () => {
    const [newAssignmentOpen, setNewAssignmentOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    useEffect(() => {
        fetch("http://localhost:3001/users/contributor", {
            method: "GET",
            mode: "cors",
        })
            .then((response) => {
                return response.json();
            })
            .then((data: User[]) => {
                setUsers(data);
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });

        fetch("http://localhost:3001/tasks", {
            method: "GET",
            mode: "cors",
        })
            .then((response) => {
                return response.json();
            })
            .then((data: Task[]) => {
                setTasks(data);
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });
    }, []);

    useEffect(() => {
        fetch(`http://localhost:3001/assignments/user/${selectedUserId}`, {
            method: "GET",
            mode: "cors",
        })
            .then((response) => {
                return response.json();
            })
            .then((data: Assignment[]) => {
                if (data.length >= 2) {
                    data.sort((a, b) => {
                        const dateA = new Date(a.task!.dueDate);
                        const dateB = new Date(b.task!.dueDate);

                        if (!dateA) return 1;
                        if (!dateB) return -1;
                        return dateA.getTime() - dateB.getTime();
                    });
                }
                setAssignments(data);
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });
    }, [selectedUserId]);

    return (
        <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
            <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <CalendarToday sx={{ fontSize: 40, color: "primary.main" }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Staff Calendar
                </Typography>
                {selectedUserId && (
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => setNewAssignmentOpen(true)}
                    >
                        Add Assignment
                    </Button>
                )}
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel id="user-select-label">Select User</InputLabel>
                    <Select
                        labelId="user-id"
                        id="user"
                        label="Contributor"
                        onChange={(e) =>
                            setSelectedUserId(e.target.value as string)
                        }
                    >
                        {users.map((user) => (
                            <MenuItem value={user.id}>{user.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {selectedUserId && assignments.length > 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {assignments.map((assignment) => (
                        <Card key={assignment.id} elevation={2}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                <Paper
                                    key={assignment.id}
                                    sx={{
                                        p: 2,
                                        bgcolor: "grey.50",
                                        border: "1px solid",
                                        borderColor: "grey.300",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                                gutterBottom
                                            >
                                                {assignment.task?.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                gutterBottom
                                            >
                                                {assignment.task?.description}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    mt: 1,
                                                }}
                                            >
                                                <Chip
                                                    label={
                                                        assignment.task?.status
                                                    }
                                                    size="small"
                                                />
                                                <Chip
                                                    label={`$${assignment.hourlyRate}/hr`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ textAlign: "right" }}>
                                            <Typography
                                                variant="body2"
                                                fontWeight="medium"
                                            >
                                                {`${assignment.task?.startDate} - ${assignment.task?.dueDate}`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>
                        </Card>
                    ))}
                </Box>
            )}
            <NewAssgnmentDialog
                userId={selectedUserId}
                tasks={tasks}
                open={newAssignmentOpen}
                onClose={() => setNewAssignmentOpen(false)}
            />
        </Box>
    );
};
