import { useEffect, useState } from "react";
import {
    AppBar,
    Box,
    Card,
    CardContent,
    Container,
    Grid,
    IconButton,
    Tabs,
    Toolbar,
    Typography,
    Tab,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ProjectStaffing } from "../../modules/project-staffing/project-staffing";
import { ProjectPhasesTasks } from "../../modules/project-phases-tasks/project-phases-tasks";
import { ProjectInvoicing } from "../../modules/project-invoicing/project-invoicing";
import { ProjectOverview } from "../../modules/project-overview/project-overview";
import type { Project } from "../../types/project.type";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

export const ProjectDetailView = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    if (!id) {
        console.error("Invalid project id");
        navigate("/");
    }

    const [activeTab, setActiveTab] = useState(0);
    const [project, setProject] = useState<Project>();

    useEffect(() => {
        fetch(`http://localhost:3001/projects/${id}`, {
            method: "GET",
            mode: "cors",
        })
            .then((response) => {
                return response.json();
            })
            .then((data: Project) => {
                setProject(data);
            })
            .catch((error) => {
                console.error("Something went wrong: " + error.message);
                return;
            });
    }, []);

    const handleBack = () => {
        navigate("/");
    };

    return project ? (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" onClick={handleBack}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {project.name}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Client
                                </Typography>
                                <Typography variant="body1">
                                    {project.clientName}
                                </Typography>
                            </Grid>
                            <Grid>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Start Date
                                </Typography>
                                <Typography variant="body1">
                                    {project.startDate}
                                </Typography>
                            </Grid>
                            <Grid>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    End Date
                                </Typography>
                                <Typography variant="body1">
                                    {project.endDate}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Tabs
                    value={activeTab}
                    onChange={(_, value) => setActiveTab(value)}
                    sx={{ mb: 3 }}
                >
                    <Tab label="Overview" />
                    <Tab label="Staffing" />
                    <Tab label="Phases & Tasks" />
                    <Tab label="Invoicing" />
                </Tabs>

                {activeTab === 0 && <ProjectOverview project={project} />}
                {activeTab === 1 && (
                    <ProjectStaffing
                        project={project}
                        onSave={(project: Project) => {
                            setProject(project);
                        }}
                    />
                )}
                {activeTab === 2 && (
                    <ProjectPhasesTasks
                        project={project}
                        onSave={(project: Project) => {
                            setProject(project);
                        }}
                    />
                )}
                {activeTab === 3 && <ProjectInvoicing project={project} />}
            </Container>
        </Box>
    ) : (
        <div>Loading...</div>
    );
};
