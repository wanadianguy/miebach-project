import { useState } from "react";
import type { NewProjectDialogProps } from "./new-project-dialog.types";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import type { Project } from "../../types/project.type";

export const NewProjectDialog = ({
    open,
    onClose,
    onSave,
}: NewProjectDialogProps) => {
    const [name, setName] = useState("");
    const [clientName, setClientName] = useState("");
    const [startDate, setStartDate] = useState({
        date: new Date(),
        string: "",
    });
    const [endDate, setEndDate] = useState({
        date: new Date(),
        string: "",
    });

    const handleSubmit = () => {
        fetch("http://localhost:3001/projects", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                clientName,
                startDate: startDate.date,
                endDate: endDate.date,
                status: "planned",
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data: Project) => onSave(data))
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });

        setName("");
        setClientName("");
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
            <DialogTitle>Create New Project</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Client Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
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
                    label="End Date"
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
