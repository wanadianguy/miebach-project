import { useEffect, useState } from "react";
import type { TimeLoggingDialogProps } from "./time-logging-dialogue.type";
import type { TimeEntry } from "../../types/time-entry.type";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

export const TimeLoggingDialog = ({
    task,
    open,
    onClose,
}: TimeLoggingDialogProps) => {
    const userId = localStorage.getItem("id");
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [selectedDate, setSelectedDate] = useState({
        date: new Date(),
        string: "",
    });
    const [hours, setHours] = useState(0);
    const [isBillable, setIsBillable] = useState(true);

    useEffect(() => {
        fetch(
            ` http://localhost:3001/time-entries/task/${task.id}/user/${userId}`,
            {
                method: "GET",
                mode: "cors",
            },
        )
            .then((response) => {
                return response.json();
            })
            .then((data: TimeEntry[]) => {
                setTimeEntries(data);
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });
    }, []);

    const handleLogTime = () => {
        if (!selectedDate || !hours || !userId) return;

        fetch(`http://localhost:3001/time-entries`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                taskId: task.id,
                userId: userId,
                workDate: selectedDate.date,
                hours: hours,
                isBillable: isBillable,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });

        setTimeEntries([]);
        setIsBillable(true);
        setSelectedDate({
            date: new Date(),
            string: "",
        });
        setHours(0);

        onClose();
    };

    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Log Time - {task.title}</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Logged Hours Summary
                    </Typography>
                    <Typography variant="h4" color="primary">
                        {totalHours}h
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                    Add Time Entry
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Date"
                        type="date"
                        value={selectedDate.string}
                        onChange={(e) =>
                            setSelectedDate({
                                date: new Date(e.target.value),
                                string: e.target.value,
                            })
                        }
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Hours"
                        type="number"
                        margin="normal"
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        inputProps={{ min: 0, step: 0.5 }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isBillable}
                                onChange={(event: any) =>
                                    setIsBillable(event.target.checked)
                                }
                            />
                        }
                        label="Billable"
                    />
                </Grid>

                <Button
                    variant="contained"
                    onClick={handleLogTime}
                    disabled={!selectedDate || !hours}
                    fullWidth
                >
                    Log Time
                </Button>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" gutterBottom>
                    Time Entry History
                </Typography>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Hours</TableCell>
                                <TableCell align="center">Billable</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timeEntries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            No time entries yet
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                timeEntries.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>{entry.workDate}</TableCell>
                                        <TableCell align="right">
                                            {entry.hours}h
                                        </TableCell>
                                        <TableCell align="center">
                                            {entry.isBillable ? "✓" : "—"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};
