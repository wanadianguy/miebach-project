/*import { useEffect, useState } from "react";
import type { TeamAvailabilityProps } from "./team-availability.types";
import type { User } from "../../types/user.type";
import {
    Box,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import type { TimeEntry } from "../../types/time-entry.type";

export const TeamAvailability = ({ projects }: TeamAvailabilityProps) => {
    const [contributors, setContributors] = useState<User[]>([]);

    useEffect(() => {
        fetch("http://localhost:3001/users/contributor", {
            method: "GET",
            mode: "cors",
        })
            .then((response) => {
                return response.json();
            })
            .then((data: User[]) => {
                setContributors(data);
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });
    }, []);

    const getTimeEntries = (userId: string) => {
        return fetch(`http://localhost:3001/time-entries/user/?${userId}`, {
            method: "GET",
            mode: "cors",
        })
            .then((response) => {
                return response.json();
            })
            .then((data: TimeEntry[]) => {
                return data;
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });
    };

    const calculateUtilization = (userId: string) => {
        let forecasted = 0;
        let logged = 0;

        projects.forEach((project) => {
            project.staffing.forEach((staff) => {
                if (staff.user.id === userId)
                    forecasted += staff.forecastedHours;
            });
        });

        getTimeEntries(userId).then((timeEntries) => {
            if (!timeEntries) return;
            else {
                timeEntries.forEach((entry) => {
                    logged += entry.hours;
                });
            }
        });

        return {
            forecasted,
            logged,
            utilization: forecasted > 0 ? (logged / forecasted) * 100 : 0,
        };
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Team Availability & Utilization
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">
                                Forecasted Hours
                            </TableCell>
                            <TableCell align="right">Logged Hours</TableCell>
                            <TableCell align="right">Remaining</TableCell>
                            <TableCell align="right">Utilization</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contributors.map((contributor) => {
                            const util = calculateUtilization(contributor.id);
                            return (
                                <TableRow key={contributor.id}>
                                    <TableCell>{contributor.name}</TableCell>
                                    <TableCell align="right">
                                        {util.forecasted}h
                                    </TableCell>
                                    <TableCell align="right">
                                        {util.logged}h
                                    </TableCell>
                                    <TableCell align="right">
                                        {util.forecasted - util.logged}h
                                    </TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            label={`${util.utilization.toFixed(0)}%`}
                                            color={
                                                util.utilization > 80
                                                    ? "error"
                                                    : util.utilization > 50
                                                      ? "warning"
                                                      : "success"
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
*/

import { useState, useMemo, useEffect } from "react";
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
                        Add Task
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
                                                {`${assignment.task?.startDate} - ${assignment.task?.endDate}`}
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
