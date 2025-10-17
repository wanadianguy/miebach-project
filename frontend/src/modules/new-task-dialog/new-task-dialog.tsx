import { useState } from "react";
import type { NewTaskDialogProps } from "./new-task-dialog.types";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

export const NewTaskDialog = ({
    project,
    open,
    onClose,
    onSave,
}: NewTaskDialogProps) => {
    const [phaseId, setPhaseId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState({
        date: new Date(),
        string: "",
    });
    const [endDate, setEndDate] = useState({
        date: new Date(),
        string: "",
    });

    const handleSubmit = () => {
        fetch("http://localhost:3001/tasks", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phaseId,
                title,
                description,
                startDate: startDate.date,
                dueDate: endDate.date,
                endDate: new Date(),
                status: "planned",
            }),
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });

        setPhaseId("");
        setTitle("");
        setDescription("");
        setStartDate({
            date: new Date(),
            string: "",
        });
        setEndDate({
            date: new Date(),
            string: "",
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogContent>
                <Select
                    labelId="phase-id"
                    id="phase"
                    label="Phase"
                    onChange={(e) => setPhaseId(e.target.value as string)}
                >
                    {project.phases.map((phase) => (
                        <MenuItem value={phase.id}>{phase.name}</MenuItem>
                    ))}
                </Select>
                <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={startDate.string}
                    onChange={(e) =>
                        setStartDate({
                            date: new Date(e.target.value),
                            string: e.target.value,
                        })
                    }
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={endDate.string}
                    onChange={(e) =>
                        setEndDate({
                            date: new Date(e.target.value),
                            string: e.target.value,
                        })
                    }
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};
