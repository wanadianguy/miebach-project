import type { ProjectStaffingProps } from "./project-staffing.types";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import type { Staff } from "../../types/staff.type";
import { NewStaffDialog } from "../new-staff-dialog/new-staff-dialog";
import type { User } from "../../types/user.type";

export const ProjectStaffing = ({ project, onSave }: ProjectStaffingProps) => {
    const [newStaffOpen, setNewStaffOpen] = useState(false);
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
    return (
        <Box>
            <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
                <Typography variant="h6">Project Staffing</Typography>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setNewStaffOpen(true)}
                >
                    Add Staff
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Hourly Rate</TableCell>
                            <TableCell align="right">Forecast Hours</TableCell>
                            <TableCell align="right">Forecast Budget</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {project.staffing.map((staff) => {
                            return (
                                <TableRow key={staff.id}>
                                    <TableCell>{staff.user.name}</TableCell>
                                    <TableCell>{staff.roleName}</TableCell>
                                    <TableCell align="right">
                                        ${staff.hourlyRate}
                                    </TableCell>
                                    <TableCell align="right">
                                        {staff.forecastedHours}
                                    </TableCell>
                                    <TableCell align="right">
                                        $
                                        {staff.hourlyRate *
                                            staff.forecastedHours}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <NewStaffDialog
                users={contributors}
                project={project}
                open={newStaffOpen}
                onClose={() => setNewStaffOpen(false)}
                onSave={(staff: Staff) => {
                    project.staffing.push(staff);
                    onSave(project);
                }}
            />
        </Box>
    );
};
