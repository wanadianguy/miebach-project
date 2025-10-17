import { useState } from "react";
import type { NewPhaseDialogProps } from "./new-phase-dialog.types";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import type { Phase } from "../../types/phase.type";

export const NewPhaseDialog = ({
    project,
    open,
    onClose,
    onSave,
}: NewPhaseDialogProps) => {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState({
        date: new Date(),
        string: "",
    });
    const [endDate, setEndDate] = useState({
        date: new Date(),
        string: "",
    });

    const handleSubmit = () => {
        fetch("http://localhost:3001/phases", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                projectId: project.id,
                name,
                startDate: startDate.date,
                endDate: endDate.date,
                status: "planned",
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data: Phase) => onSave(data))
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });

        setName("");
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
            <DialogTitle>Create New Phase</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Phase Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
