import { useEffect, useState } from "react";
import type { ManagerDashboardProps } from "./manager-dashboard.type";
import type { Project } from "../../types/project.type";
import {
    AppBar,
    Box,
    Container,
    IconButton,
    Tabs,
    Toolbar,
    Typography,
    Tab,
    Button,
} from "@mui/material";
import { Add, Logout } from "@mui/icons-material";
import { ProjectCard } from "../project-card/project-card";
import { NewProjectDialog } from "../new-project-dialog/new-project-dialog";
import { TeamAvailability } from "../team-availability/team-availability";
import { Reports } from "../reports/reports";
import { useNavigate } from "react-router";

export const ManagerDashboard = ({
    onLogout,
    onNavigate,
}: ManagerDashboardProps) => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectOpen, setNewProjectOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const getProjects = async () => {
            await fetch("http://localhost:3001/projects", {
                method: "GET",
                mode: "cors",
            })
                .then((response) => {
                    return response.json();
                })
                .then((data: Project[]) => {
                    setProjects(data);
                })
                .catch((error) => {
                    console.error("Something went wrong: " + error.message);
                    return;
                });
        };

        getProjects();
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Manager Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={onLogout}>
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, value) => setActiveTab(value)}
                    sx={{ mb: 3 }}
                >
                    <Tab label="Projects" />
                    <Tab label="Team Availability" />
                    {/*<Tab label="Reports" />*/}
                </Tabs>

                {activeTab === 0 && (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 3,
                            }}
                        >
                            <Typography variant="h5">Projects</Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setNewProjectOpen(true)}
                            >
                                New Project
                            </Button>
                        </Box>

                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onOpen={() =>
                                    navigate(`/project/${project.id}`)
                                }
                            />
                        ))}
                    </>
                )}

                {activeTab === 1 && <TeamAvailability projects={projects} />}

                {/*activeTab === 2 && <Reports projects={projects} />*/}
            </Container>

            <NewProjectDialog
                open={newProjectOpen}
                onClose={() => setNewProjectOpen(false)}
                onSave={(project: Project) => {
                    projects.push(project);
                    setProjects(projects);
                }}
            />
        </Box>
    );
};
