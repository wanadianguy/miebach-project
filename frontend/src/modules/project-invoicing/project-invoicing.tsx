import { useEffect, useState } from "react";
import type {
    ProjectInvoicingProps,
    DetailedInvoice,
    InvoiceItem,
} from "./project-invoicing.types";
import {
    Box,
    Button,
    Card,
    CardContent,
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
import { useParams } from "react-router";
import type { TimeEntry } from "../../types/time-entry.type";
import type { Staff } from "../../types/staff.type";
import { Receipt } from "@mui/icons-material";

export const ProjectInvoicing = ({ project }: ProjectInvoicingProps) => {
    const { id } = useParams();
    const [periodStart, setPeriodStart] = useState({
        date: new Date(),
        string: "",
    });
    const [periodEnd, setPeriodEnd] = useState({
        date: new Date(),
        string: "",
    });
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>();
    const [staffing, setStaffing] = useState<Staff[]>();
    const [detailedInvoice, setDetailedInvoice] = useState<DetailedInvoice>({
        items: [],
        total: 0,
    });

    useEffect(() => {
        fetch(`http://localhost:3001/time-entries/project/${id}`, {
            method: "GET",
            mode: "cors",
        })
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

        fetch(`http://localhost:3001/staffing/project/${id}`, {
            method: "GET",
            mode: "cors",
        })
            .then((response) => {
                return response.json();
            })
            .then((data: Staff[]) => {
                setStaffing(data);
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });
    }, []);

    useEffect(() => {
        const items: InvoiceItem[] = [];
        let total = 0;
        if (!timeEntries || timeEntries.length === 0) return;
        if (!staffing || staffing.length === 0) return;

        timeEntries.forEach((entry) => {
            const workDate = new Date(entry.workDate);
            if (
                workDate >= periodStart.date &&
                workDate <= periodEnd.date &&
                entry.isBillable
            ) {
                const staff = staffing.find(
                    (staffMember) => staffMember.user?.id === entry.user?.id,
                );
                const amount = entry.hours * (staff?.hourlyRate ?? 0);

                items.push({
                    task: entry.task?.title ?? "",
                    phase: entry.task?.phase?.name ?? "",
                    hours: entry.hours,
                    rate: staff?.hourlyRate ?? 0,
                    amount,
                });

                total += amount;
            }
        });

        setDetailedInvoice({ items, total });
    }, [periodStart, periodEnd, staffing, timeEntries]);

    const submitInvoice = () => {
        fetch(`http://localhost:3001/invoices`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                projectId: project.id,
                clientName: project.clientName,
                startDate: periodStart.date,
                endDate: periodEnd.date,
                amount: detailedInvoice.total,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Generate Invoice
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid>
                    <TextField
                        fullWidth
                        label="Period Start"
                        type="date"
                        value={periodStart.string}
                        onChange={(event) => {
                            setPeriodStart({
                                date: new Date(event.target.value),
                                string: event.target.value,
                            });
                        }}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid>
                    <TextField
                        fullWidth
                        label="Period End"
                        type="date"
                        value={periodEnd.string}
                        onChange={(event) => {
                            setPeriodEnd({
                                date: new Date(event.target.value),
                                string: event.target.value,
                            });
                        }}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={submitInvoice}
                        sx={{ height: "56px" }}
                    >
                        Submit Invoice
                    </Button>
                </Grid>
            </Grid>

            {detailedInvoice && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Invoice for {project.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Client: {project.clientName}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            {`Period: ${periodStart.string} to ${periodEnd.string}`}
                        </Typography>

                        <TableContainer sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Task</TableCell>
                                        <TableCell>Phase</TableCell>
                                        <TableCell align="right">
                                            Hours
                                        </TableCell>
                                        <TableCell align="right">
                                            Rate
                                        </TableCell>
                                        <TableCell align="right">
                                            Amount
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {detailedInvoice.items &&
                                        detailedInvoice.items.map(
                                            (item, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>
                                                        {item.task}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.phase}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {item.hours}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        ${item.rate}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        $
                                                        {item.amount.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    <TableRow>
                                        <TableCell colSpan={4} align="right">
                                            <Typography variant="h6">
                                                Total:
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="h6">
                                                $
                                                {detailedInvoice.total.toFixed(
                                                    2,
                                                )}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                            <Button variant="contained" startIcon={<Receipt />}>
                                Export PDF
                            </Button>
                            <Button variant="outlined">Export CSV</Button>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};
