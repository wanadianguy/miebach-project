import type { ProjectOverviewProps } from "./project-overview.types";
import { Grid } from "@mui/system";
import { Card, CardContent, Typography } from "@mui/material";

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
    const budget = {
        forecast: project.forecastedBudget,
        actual: project.budget,
        remaining: project.forecastedBudget - project.budget,
    };

    return (
        <Grid container spacing={3}>
            <Grid>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                            Forecast Budget
                        </Typography>
                        <Typography variant="h4">
                            ${budget.forecast.toFixed(0)}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                            Actual Spent
                        </Typography>
                        <Typography variant="h4">
                            ${budget.actual.toFixed(0)}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                            Remaining
                        </Typography>
                        <Typography
                            variant="h4"
                            color={
                                budget.remaining < 0 ? "error" : "success.main"
                            }
                        >
                            ${budget.remaining.toFixed(0)}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
