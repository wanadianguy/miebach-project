import { useState } from "react";
import type { NewStaffDialogProps } from "./new-staff-dialog.types";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    TextField,
    Grid,
} from "@mui/material";
import type { Staff } from "../../types/staff.type";

export const NewStaffDialog = ({
    users,
    project,
    open,
    onClose,
    onSave,
}: NewStaffDialogProps) => {
    const [userId, setUserId] = useState("");
    const [roleName, setRoleName] = useState("");
    const [hourlyRate, setHourlyRate] = useState(0);
    const [forecastedHours, setForecastedHours] = useState(0);

    const handleSubmit = () => {
        fetch("http://localhost:3001/staffing", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roleName,
                hourlyRate,
                forecastedHours,
                projectId: project.id,
                userId,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data: Staff) => onSave(data))
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });

        setUserId("");
        setRoleName("");
        setHourlyRate(0);
        setForecastedHours(0);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Phase</DialogTitle>
            <DialogContent>
                <Select
                    labelId="user-id"
                    id="user"
                    label="User"
                    onChange={(e) => setUserId(e.target.value as string)}
                >
                    {users.map((user) => (
                        <MenuItem value={user.id}>{user.name}</MenuItem>
                    ))}
                </Select>
                <TextField
                    fullWidth
                    label="Role Name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Hourly Rate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    margin="normal"
                    inputProps={{ min: 0, step: 1 }}
                />
                <TextField
                    fullWidth
                    label="Forecasted Hours"
                    type="number"
                    margin="normal"
                    value={forecastedHours}
                    onChange={(e) => setForecastedHours(Number(e.target.value))}
                    inputProps={{ min: 0, step: 1 }}
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
