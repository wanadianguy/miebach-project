import { useState, createContext, useContext } from "react";
import {
	ThemeProvider,
	createTheme,
	CssBaseline,
	Container,
	Box,
	TextField,
	Button,
	Card,
	CardContent,
	CardActions,
	Typography,
	AppBar,
	Toolbar,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Collapse,
	Grid,
	Chip,
	Tab,
	Tabs,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	LinearProgress,
	Alert,
	Menu,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Checkbox,
	FormControlLabel,
	Divider,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
} from "@mui/material";
import {
	ExpandMore,
	ExpandLess,
	Add,
	Logout,
	Dashboard,
	Assignment,
	Person,
	CalendarMonth,
	Receipt,
	MoreVert,
	Edit,
	Delete,
	AccessTime,
	ArrowBack,
} from "@mui/icons-material";

interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

interface Project {
	id: number;
	name: string;
	client_name: string;
	start_date: string;
	end_date: string;
	staffing: ProjectStaffing[];
	phases: ProjectPhase[];
}

interface ProjectStaffing {
	id: number;
	project_id: number;
	user_id: number;
	role_name: string;
	hourly_rate: number;
	forecast_hours: number;
}

interface ProjectPhase {
	id: number;
	project_id: number;
	name: string;
	start_date: string;
	end_date: string;
	tasks: Task[];
}

interface Task {
	id: number;
	phase_id: number;
	title: string;
	description: string;
	start_date: string;
	end_date: string;
	status: string;
	budget: number;
	assignments: TaskAssignment[];
	time_entries: TimeEntry[];
}

interface TaskAssignment {
	id: number;
	task_id: number;
	user_id: number;
	hourly_rate: number;
}

interface TimeEntry {
	id: number;
	task_id: number;
	user_id: number;
	work_date: string;
	hours: number;
	is_billable: boolean;
}

interface Invoice {
	id?: number;
	project_id: number;
	client_name: string;
	period_start: string;
	period_end: string;
	total_amount: number;
}

interface InvoiceItem {
	task: string;
	phase: string;
	contributor: string;
	hours: number;
	rate: number;
	amount: number;
}

interface GeneratedInvoice {
	items: InvoiceItem[];
	total: number;
}

interface BudgetInfo {
	forecast: number;
	actual: number;
	remaining: number;
}

interface UtilizationInfo {
	forecasted: number;
	logged: number;
	utilization: number;
}

interface AppContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	projects: Project[];
	setProjects: (projects: Project[]) => void;
	users: User[];
}

interface TaskWithProject extends Task {
	projectName: string;
	phaseName: string;
	project: Project;
}

// Mock Data
const MOCK_USERS = [
	{ id: 1, name: "John Manager", email: "manager@test.com", role: "manager" },
	{
		id: 2,
		name: "Alice Consultant",
		email: "alice@test.com",
		role: "contributor",
	},
	{ id: 3, name: "Bob Analyst", email: "bob@test.com", role: "contributor" },
];

const MOCK_PROJECTS = [
	{
		id: 1,
		name: "Project ABC",
		client_name: "Acme Corp",
		start_date: "2025-01-01",
		end_date: "2025-12-31",
		staffing: [
			{
				id: 1,
				project_id: 1,
				user_id: 2,
				role_name: "Consultant",
				hourly_rate: 100,
				forecast_hours: 240,
			},
			{
				id: 2,
				project_id: 1,
				user_id: 3,
				role_name: "Analyst",
				hourly_rate: 80,
				forecast_hours: 128,
			},
		],
		phases: [
			{
				id: 1,
				project_id: 1,
				name: "Design",
				start_date: "2025-01-01",
				end_date: "2025-03-31",
				tasks: [
					{
						id: 1,
						phase_id: 1,
						title: "Website Redesign",
						description: "Complete redesign of company website",
						start_date: "2025-01-01",
						end_date: "2025-02-15",
						status: "in_progress",
						budget: 2000,
						assignments: [
							{ id: 1, task_id: 1, user_id: 2, hourly_rate: 100 },
						],
						time_entries: [
							{
								id: 1,
								task_id: 1,
								user_id: 2,
								work_date: "2025-01-13",
								hours: 8,
								is_billable: true,
							},
							{
								id: 2,
								task_id: 1,
								user_id: 2,
								work_date: "2025-01-14",
								hours: 6,
								is_billable: true,
							},
						],
					},
				],
			},
			{
				id: 2,
				project_id: 1,
				name: "Development",
				start_date: "2025-04-01",
				end_date: "2025-09-30",
				tasks: [
					{
						id: 2,
						phase_id: 2,
						title: "Data Migration Script",
						description: "Migrate legacy data to new system",
						start_date: "2025-04-01",
						end_date: "2025-05-15",
						status: "planned",
						budget: 1600,
						assignments: [
							{ id: 2, task_id: 2, user_id: 3, hourly_rate: 80 },
						],
						time_entries: [],
					},
				],
			},
		],
	},
];

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

const useApp = () => {
	const context = useContext(AppContext);
	if (!context) throw new Error("useApp must be used within AppProvider");
	return context;
};

// Theme
const theme = createTheme({
	palette: {
		mode: "light",
		primary: { main: "#1976d2" },
		secondary: { main: "#dc004e" },
	},
});

interface LoginProps {
	onLogin: (user: User) => void;
}

// Login Component
const Login: React.FC<LoginProps> = ({ onLogin }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		// Mock authentication
		const user = MOCK_USERS.find((u) => u.email === email);
		if (user) {
			onLogin(user);
		} else {
			setError("Invalid credentials");
		}
	};

	return (
		<Container maxWidth="sm">
			<Box
				sx={{
					mt: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Card sx={{ width: "100%", p: 2 }}>
					<CardContent>
						<Typography variant="h4" align="center" gutterBottom>
							Project Management
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							align="center"
							sx={{ mb: 3 }}
						>
							Sign in to continue
						</Typography>

						{error && (
							<Alert severity="error" sx={{ mb: 2 }}>
								{error}
							</Alert>
						)}

						<Box component="form" onSubmit={handleSubmit}>
							<TextField
								fullWidth
								label="Email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								margin="normal"
								required
							/>
							<TextField
								fullWidth
								label="Password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								margin="normal"
								required
							/>
							<Button
								fullWidth
								variant="contained"
								type="submit"
								sx={{ mt: 3, mb: 2 }}
							>
								Sign In
							</Button>

							<Divider sx={{ my: 2 }} />

							<Typography
								variant="caption"
								display="block"
								color="text.secondary"
							>
								Demo Accounts:
							</Typography>
							<Typography variant="caption" display="block">
								Manager: manager@test.com
							</Typography>
							<Typography variant="caption" display="block">
								Contributor: alice@test.com or bob@test.com
							</Typography>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Container>
	);
};

interface ProjectCardProps {
	project: Project;
	onOpen: (project: Project) => void;
	onEdit?: (project: Project) => void;
	onDelete?: (project: Project) => void;
}

// Project Card Component
const ProjectCard: React.FC<ProjectCardProps> = ({
	project,
	onOpen,
	onEdit,
	onDelete,
}) => {
	const [expanded, setExpanded] = useState(false);
	const { users } = useApp();

	const calculateBudget = () => {
		let forecast = 0;
		let actual = 0;

		project.staffing.forEach((s) => {
			forecast += s.hourly_rate * s.forecast_hours;
		});

		project.phases.forEach((phase) => {
			phase.tasks.forEach((task) => {
				task.time_entries.forEach((entry) => {
					const assignment = task.assignments.find(
						(a) => a.user_id === entry.user_id,
					);
					if (assignment) {
						actual += entry.hours * assignment.hourly_rate;
					}
				});
			});
		});

		return { forecast, actual, remaining: forecast - actual };
	};

	const budget = calculateBudget();
	const progress =
		budget.forecast > 0 ? (budget.actual / budget.forecast) * 100 : 0;

	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
					}}
				>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h6">{project.name}</Typography>
						<Typography color="text.secondary" variant="body2">
							Client: {project.client_name}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{project.start_date} - {project.end_date}
						</Typography>
					</Box>
					<IconButton
						size="small"
						onClick={() => setExpanded(!expanded)}
					>
						{expanded ? <ExpandLess /> : <ExpandMore />}
					</IconButton>
				</Box>

				<Box sx={{ mt: 2 }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							mb: 1,
						}}
					>
						<Typography variant="body2">Budget Progress</Typography>
						<Typography variant="body2">
							{progress.toFixed(0)}%
						</Typography>
					</Box>
					<LinearProgress
						variant="determinate"
						value={Math.min(progress, 100)}
					/>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							mt: 1,
						}}
					>
						<Typography variant="caption">
							${budget.actual.toFixed(0)} / $
							{budget.forecast.toFixed(0)}
						</Typography>
						<Typography
							variant="caption"
							color={
								budget.remaining < 0 ? "error" : "success.main"
							}
						>
							${budget.remaining.toFixed(0)} remaining
						</Typography>
					</Box>
				</Box>

				<Collapse in={expanded}>
					<Box sx={{ mt: 3 }}>
						<Typography variant="subtitle2" gutterBottom>
							Team
						</Typography>
						<Box sx={{ mb: 2 }}>
							{project.staffing.map((s) => {
								const user = users.find(
									(u) => u.id === s.user_id,
								);
								return (
									<Chip
										key={s.id}
										label={`${user?.name} - ${s.role_name}`}
										size="small"
										sx={{ mr: 1, mb: 1 }}
									/>
								);
							})}
						</Box>

						<Typography variant="subtitle2" gutterBottom>
							Phases
						</Typography>
						{project.phases.map((phase) => (
							<Box
								key={phase.id}
								sx={{
									mb: 2,
									pl: 2,
									borderLeft: "3px solid #1976d2",
								}}
							>
								<Typography variant="body2" fontWeight="bold">
									{phase.name}
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{phase.tasks.length} task(s)
								</Typography>
							</Box>
						))}
					</Box>
				</Collapse>
			</CardContent>

			<CardActions>
				<Button size="small" onClick={() => onOpen(project)}>
					Open Project
				</Button>
			</CardActions>
		</Card>
	);
};

interface NewProjectDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (project: Omit<Project, "staffing" | "phases">) => void;
}

interface ProjectFormData {
	name: string;
	client_name: string;
	start_date: string;
	end_date: string;
}

// New Project Dialog
const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
	open,
	onClose,
	onSave,
}) => {
	const [formData, setFormData] = useState({
		name: "",
		client_name: "",
		start_date: "",
		end_date: "",
	});

	const handleSubmit = () => {
		onSave({ ...formData, id: Date.now() });
		setFormData({
			name: "",
			client_name: "",
			start_date: "",
			end_date: "",
		});
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Create New Project</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					label="Project Name"
					value={formData.name}
					onChange={(e) =>
						setFormData({ ...formData, name: e.target.value })
					}
					margin="normal"
				/>
				<TextField
					fullWidth
					label="Client Name"
					value={formData.client_name}
					onChange={(e) =>
						setFormData({
							...formData,
							client_name: e.target.value,
						})
					}
					margin="normal"
				/>
				<TextField
					fullWidth
					label="Start Date"
					type="date"
					value={formData.start_date}
					onChange={(e) =>
						setFormData({ ...formData, start_date: e.target.value })
					}
					margin="normal"
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					fullWidth
					label="End Date"
					type="date"
					value={formData.end_date}
					onChange={(e) =>
						setFormData({ ...formData, end_date: e.target.value })
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

interface ManagerDashboardProps {
	onLogout: () => void;
	onNavigate: (view: string, data?: any, readOnly?: boolean) => void;
}

// Manager Dashboard
const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
	onLogout,
	onNavigate,
}) => {
	const { projects, setProjects } = useApp();
	const [newProjectOpen, setNewProjectOpen] = useState(false);
	const [activeTab, setActiveTab] = useState(0);

	const handleNewProject = (
		projectData: Omit<Project, "staffing" | "phases">,
	) => {
		setProjects([
			...projects,
			{ ...projectData, staffing: [], phases: [] },
		]);
		setNewProjectOpen(false);
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Dashboard sx={{ mr: 2 }} />
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
					onChange={(e, v) => setActiveTab(v)}
					sx={{ mb: 3 }}
				>
					<Tab label="Projects" />
					<Tab label="Team Availability" />
					<Tab label="Reports" />
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
								onOpen={(p) => onNavigate("project-detail", p)}
							/>
						))}
					</>
				)}

				{activeTab === 1 && <TeamAvailability />}

				{activeTab === 2 && <Reports />}
			</Container>

			<NewProjectDialog
				open={newProjectOpen}
				onClose={() => setNewProjectOpen(false)}
				onSave={handleNewProject}
			/>
		</Box>
	);
};

// Team Availability Component
const TeamAvailability = () => {
	const { projects, users } = useApp();

	const getContributors = () => {
		return users.filter((u) => u.role === "contributor");
	};

	const calculateUtilization = (userId: number) => {
		let forecasted = 0;
		let logged = 0;

		projects.forEach((project) => {
			const staffing = project.staffing.find((s) => s.user_id === userId);
			if (staffing) {
				forecasted += staffing.forecast_hours;
			}

			project.phases.forEach((phase) => {
				phase.tasks.forEach((task) => {
					task.time_entries.forEach((entry) => {
						if (entry.user_id === userId) {
							logged += entry.hours;
						}
					});
				});
			});
		});

		return {
			forecasted,
			logged,
			utilization: forecasted > 0 ? (logged / forecasted) * 100 : 0,
		};
	};

	return (
		<Box>
			<Typography variant="h5" gutterBottom>
				Team Availability & Utilization
			</Typography>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="right">
								Forecasted Hours
							</TableCell>
							<TableCell align="right">Logged Hours</TableCell>
							<TableCell align="right">Remaining</TableCell>
							<TableCell align="right">Utilization</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{getContributors().map((user) => {
							const util = calculateUtilization(user.id);
							return (
								<TableRow key={user.id}>
									<TableCell>{user.name}</TableCell>
									<TableCell align="right">
										{util.forecasted}h
									</TableCell>
									<TableCell align="right">
										{util.logged}h
									</TableCell>
									<TableCell align="right">
										{util.forecasted - util.logged}h
									</TableCell>
									<TableCell align="right">
										<Chip
											label={`${util.utilization.toFixed(0)}%`}
											color={
												util.utilization > 80
													? "error"
													: util.utilization > 50
														? "warning"
														: "success"
											}
											size="small"
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

// Reports Component
const Reports = () => {
	const { projects } = useApp();
	const [selectedProject, setSelectedProject] = useState<number | string>("");

	return (
		<Box>
			<Typography variant="h5" gutterBottom>
				Budget & Utilization Reports
			</Typography>

			<FormControl fullWidth sx={{ mb: 3 }}>
				<InputLabel>Select Project</InputLabel>
				<Select
					value={selectedProject}
					onChange={(e) => setSelectedProject(e.target.value)}
					label="Select Project"
				>
					{projects.map((p) => (
						<MenuItem key={p.id} value={p.id}>
							{p.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{selectedProject && (
				<BudgetReport
					project={projects.find((p) => p.id === selectedProject)}
				/>
			)}
		</Box>
	);
};

interface BudgetReportProps {
	project?: Project;
}

// Budget Report Component
const BudgetReport: React.FC<BudgetReportProps> = ({ project }) => {
	const { users } = useApp();

	const calculateTaskBudget = (task: Task) => {
		let actual = 0;
		task.time_entries.forEach((entry) => {
			const assignment = task.assignments.find(
				(a) => a.user_id === entry.user_id,
			);
			if (assignment) {
				actual += entry.hours * assignment.hourly_rate;
			}
		});
		return { budget: task.budget, actual, remaining: task.budget - actual };
	};

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Phase</TableCell>
						<TableCell>Task</TableCell>
						<TableCell align="right">Budget</TableCell>
						<TableCell align="right">Actual</TableCell>
						<TableCell align="right">Remaining</TableCell>
						<TableCell align="right">Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{project?.phases.map((phase) =>
						phase.tasks.map((task) => {
							const budget = calculateTaskBudget(task);
							return (
								<TableRow key={task.id}>
									<TableCell>{phase.name}</TableCell>
									<TableCell>{task.title}</TableCell>
									<TableCell align="right">
										${budget.budget}
									</TableCell>
									<TableCell align="right">
										${budget.actual.toFixed(2)}
									</TableCell>
									<TableCell
										align="right"
										sx={{
											color:
												budget.remaining < 0
													? "error.main"
													: "success.main",
										}}
									>
										${budget.remaining.toFixed(2)}
									</TableCell>
									<TableCell align="right">
										<Chip
											label={task.status}
											size="small"
										/>
									</TableCell>
								</TableRow>
							);
						}),
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

interface ProjectDetailViewProps {
	project: Project;
	onBack: () => void;
	isReadOnly?: boolean;
}

// Project Detail View
const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
	project,
	onBack,
	isReadOnly,
}) => {
	const { users } = useApp();
	const [activeTab, setActiveTab] = useState(0);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton color="inherit" onClick={onBack}>
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
									{project.client_name}
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
									{project.start_date}
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
									{project.end_date}
								</Typography>
							</Grid>
						</Grid>
					</CardContent>
				</Card>

				<Tabs
					value={activeTab}
					onChange={(e, v) => setActiveTab(v)}
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
						isReadOnly={isReadOnly}
					/>
				)}
				{activeTab === 2 && (
					<ProjectPhasesTasks
						project={project}
						isReadOnly={isReadOnly}
					/>
				)}
				{activeTab === 3 && <ProjectInvoicing project={project} />}
			</Container>
		</Box>
	);
};

interface ProjectOverviewProps {
	project: Project;
}

// Project Overview
const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
	const calculateOverallBudget = () => {
		let forecast = 0;
		let actual = 0;

		project.staffing.forEach((s) => {
			forecast += s.hourly_rate * s.forecast_hours;
		});

		project.phases.forEach((phase) => {
			phase.tasks.forEach((task) => {
				task.time_entries.forEach((entry) => {
					const assignment = task.assignments.find(
						(a) => a.user_id === entry.user_id,
					);
					if (assignment) {
						actual += entry.hours * assignment.hourly_rate;
					}
				});
			});
		});

		return { forecast, actual, remaining: forecast - actual };
	};

	const budget = calculateOverallBudget();

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

interface ProjectStaffingProps {
	project: Project;
	isReadOnly?: boolean;
}

// Project Staffing
const ProjectStaffing: React.FC<ProjectStaffingProps> = ({
	project,
	isReadOnly,
}) => {
	const { users } = useApp();

	return (
		<Box>
			<Box
				sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
			>
				<Typography variant="h6">Project Staffing</Typography>
				{!isReadOnly && (
					<Button variant="outlined" startIcon={<Add />}>
						Add Staff
					</Button>
				)}
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
							const user = users.find(
								(u) => u.id === staff.user_id,
							);
							return (
								<TableRow key={staff.id}>
									<TableCell>{user?.name}</TableCell>
									<TableCell>{staff.role_name}</TableCell>
									<TableCell align="right">
										${staff.hourly_rate}
									</TableCell>
									<TableCell align="right">
										{staff.forecast_hours}h
									</TableCell>
									<TableCell align="right">
										$
										{staff.hourly_rate *
											staff.forecast_hours}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

interface ProjectPhasesTasksProps {
	project: Project;
	isReadOnly?: boolean;
}
// Project Phases & Tasks
const ProjectPhasesTasks: React.FC<ProjectPhasesTasksProps> = ({
	project,
	isReadOnly,
}) => {
	return (
		<Box>
			{!isReadOnly && (
				<Box sx={{ display: "flex", gap: 2, mb: 3 }}>
					<Button variant="outlined" startIcon={<Add />}>
						Add Phase
					</Button>
					<Button variant="outlined" startIcon={<Add />}>
						Add Task
					</Button>
				</Box>
			)}

			{project.phases.map((phase) => (
				<Card key={phase.id} sx={{ mb: 2 }}>
					<CardContent>
						<Typography variant="h6">{phase.name}</Typography>
						<Typography variant="caption" color="text.secondary">
							{phase.start_date} - {phase.end_date}
						</Typography>

						<Box sx={{ mt: 2 }}>
							{phase.tasks.map((task) => (
								<Paper key={task.id} sx={{ p: 2, mb: 1 }}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
										}}
									>
										<Box>
											<Typography variant="subtitle1">
												{task.title}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												{task.description}
											</Typography>
											<Box sx={{ mt: 1 }}>
												<Chip
													label={task.status}
													size="small"
													sx={{ mr: 1 }}
												/>
												<Chip
													label={`Budget: $${task.budget}`}
													size="small"
													variant="outlined"
												/>
											</Box>
										</Box>
										<Box sx={{ textAlign: "right" }}>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												{task.start_date}
											</Typography>
											<Typography
												variant="caption"
												display="block"
												color="text.secondary"
											>
												{task.end_date}
											</Typography>
										</Box>
									</Box>
								</Paper>
							))}
						</Box>
					</CardContent>
				</Card>
			))}
		</Box>
	);
};

interface ProjectInvoicingProps {
	project: Project;
}
// Project Invoicing
const ProjectInvoicing: React.FC<ProjectInvoicingProps> = ({ project }) => {
	const { users } = useApp();
	const [periodStart, setPeriodStart] = useState("");
	const [periodEnd, setPeriodEnd] = useState("");
	const [invoice, setInvoice] = useState<{
		items: InvoiceItem[];
		total: number;
	}>({ items: [], total: 0 });

	const generateInvoice = () => {
		const items: InvoiceItem[] = [];
		let total = 0;

		project.phases.forEach((phase) => {
			phase.tasks.forEach((task) => {
				task.time_entries.forEach((entry) => {
					if (
						entry.work_date >= periodStart &&
						entry.work_date <= periodEnd &&
						entry.is_billable
					) {
						const assignment = task.assignments.find(
							(a) => a.user_id === entry.user_id,
						);
						const user = users.find((u) => u.id === entry.user_id);
						const amount =
							entry.hours * (assignment?.hourly_rate || 0);

						items.push({
							task: task.title,
							phase: phase.name,
							contributor: user?.name || "",
							hours: entry.hours,
							rate: assignment?.hourly_rate || 0,
							amount,
						});

						total += amount;
					}
				});
			});
		});

		setInvoice({ items, total });
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
						value={periodStart}
						onChange={(e) => setPeriodStart(e.target.value)}
						InputLabelProps={{ shrink: true }}
					/>
				</Grid>
				<Grid>
					<TextField
						fullWidth
						label="Period End"
						type="date"
						value={periodEnd}
						onChange={(e) => setPeriodEnd(e.target.value)}
						InputLabelProps={{ shrink: true }}
					/>
				</Grid>
				<Grid>
					<Button
						fullWidth
						variant="contained"
						onClick={generateInvoice}
						sx={{ height: "56px" }}
					>
						Generate Invoice
					</Button>
				</Grid>
			</Grid>

			{invoice && (
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
							Client: {project.client_name}
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							gutterBottom
						>
							Period: {periodStart} to {periodEnd}
						</Typography>

						<TableContainer sx={{ mt: 2 }}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Task</TableCell>
										<TableCell>Phase</TableCell>
										<TableCell>Contributor</TableCell>
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
									{invoice.items.map((item, idx) => (
										<TableRow key={idx}>
											<TableCell>{item.task}</TableCell>
											<TableCell>{item.phase}</TableCell>
											<TableCell>
												{item.contributor}
											</TableCell>
											<TableCell align="right">
												{item.hours}h
											</TableCell>
											<TableCell align="right">
												${item.rate}
											</TableCell>
											<TableCell align="right">
												${item.amount.toFixed(2)}
											</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell colSpan={5} align="right">
											<Typography variant="h6">
												Total:
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography variant="h6">
												${invoice.total.toFixed(2)}
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

// Contributor Dashboard
interface ContributorDashboardProps {
	onLogout: () => void;
	onNavigate: (view: string, data?: any, readOnly?: boolean) => void;
}

const ContributorDashboard: React.FC<ContributorDashboardProps> = ({
	onLogout,
	onNavigate,
}) => {
	const { projects, user } = useApp();
	const [selectedTask, setSelectedTask] = useState<TaskWithProject | null>(
		null,
	);

	const getAssignedTasks = (): TaskWithProject[] => {
		const tasks: TaskWithProject[] = [];
		projects.forEach((project) => {
			project.phases.forEach((phase) => {
				phase.tasks.forEach((task) => {
					const isAssigned = task.assignments.some(
						(a) => a.user_id === user?.id,
					);
					if (isAssigned) {
						tasks.push({
							...task,
							projectName: project.name,
							phaseName: phase.name,
							project,
						});
					}
				});
			});
		});
		return tasks;
	};

	const assignedTasks = getAssignedTasks();

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Assignment sx={{ mr: 2 }} />
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						My Tasks
					</Typography>
					<IconButton color="inherit" onClick={onLogout}>
						<Logout />
					</IconButton>
				</Toolbar>
			</AppBar>

			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				<Typography variant="h5" gutterBottom>
					Assigned Tasks
				</Typography>

				<Grid container spacing={2}>
					{assignedTasks.map((task) => (
						<Grid item xs={12} md={6} key={task.id}>
							<Card>
								<CardContent>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											mb: 1,
										}}
									>
										<Typography variant="h6">
											{task.title}
										</Typography>
										<Chip
											label={task.status}
											size="small"
										/>
									</Box>

									<Typography
										variant="body2"
										color="text.secondary"
										gutterBottom
									>
										{task.description}
									</Typography>

									<Box sx={{ mt: 2 }}>
										<Typography
											variant="caption"
											color="text.secondary"
											display="block"
										>
											Project: {task.projectName}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
											display="block"
										>
											Phase: {task.phaseName}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
											display="block"
										>
											Due: {task.end_date}
										</Typography>
									</Box>

									<Box
										sx={{ mt: 2, display: "flex", gap: 1 }}
									>
										<Button
											size="small"
											variant="contained"
											startIcon={<AccessTime />}
											onClick={() =>
												setSelectedTask(task)
											}
										>
											Log Hours
										</Button>
										<Button
											size="small"
											variant="outlined"
											onClick={() =>
												onNavigate(
													"project-detail",
													task.project,
													true,
												)
											}
										>
											View Project
										</Button>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Container>

			{selectedTask && (
				<TimeLoggingDialog
					task={selectedTask}
					open={!!selectedTask}
					onClose={() => setSelectedTask(null)}
				/>
			)}
		</Box>
	);
};

// Time Logging Dialog
interface TimeLoggingDialogProps {
	task: TaskWithProject;
	open: boolean;
	onClose: () => void;
}

const TimeLoggingDialog: React.FC<TimeLoggingDialogProps> = ({
	task,
	open,
	onClose,
}) => {
	const { user, projects, setProjects } = useApp();
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [hours, setHours] = useState<string>("");
	const [isBillable, setIsBillable] = useState<boolean>(true);

	const getTimeEntries = (): TimeEntry[] => {
		return task.time_entries.filter((e) => e.user_id === user?.id);
	};

	const handleLogTime = () => {
		if (!selectedDate || !hours || !user) return;

		const newEntry: TimeEntry = {
			id: Date.now(),
			task_id: task.id,
			user_id: user.id,
			work_date: selectedDate,
			hours: parseFloat(hours),
			is_billable: isBillable,
		};

		const updatedProjects = projects.map((project) => {
			if (project.id === task.project.id) {
				return {
					...project,
					phases: project.phases.map((phase) => ({
						...phase,
						tasks: phase.tasks.map((t) => {
							if (t.id === task.id) {
								return {
									...t,
									time_entries: [...t.time_entries, newEntry],
								};
							}
							return t;
						}),
					})),
				};
			}
			return project;
		});

		setProjects(updatedProjects);
		setSelectedDate("");
		setHours("");
	};

	const timeEntries = getTimeEntries();
	const totalHours = timeEntries.reduce((sum, e) => sum + e.hours, 0);

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
					<Grid item xs={12} md={4}>
						<TextField
							fullWidth
							label="Date"
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							InputLabelProps={{ shrink: true }}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							fullWidth
							label="Hours"
							type="number"
							value={hours}
							onChange={(e) => setHours(e.target.value)}
							inputProps={{ min: 0, step: 0.5 }}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<FormControlLabel
							control={
								<Checkbox
									checked={isBillable}
									onChange={(e) =>
										setIsBillable(e.target.checked)
									}
								/>
							}
							label="Billable"
						/>
					</Grid>
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
										<TableCell>{entry.work_date}</TableCell>
										<TableCell align="right">
											{entry.hours}h
										</TableCell>
										<TableCell align="center">
											{entry.is_billable ? "✓" : "—"}
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

// Main App Component
const AppAi: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
	const [currentView, setCurrentView] = useState<string>("dashboard");
	const [selectedProject, setSelectedProject] = useState<Project | null>(
		null,
	);
	const [isProjectReadOnly, setIsProjectReadOnly] = useState<boolean>(false);

	const handleLogin = (userData: User) => {
		setUser(userData);
		setCurrentView("dashboard");
	};

	const handleLogout = () => {
		setUser(null);
		setCurrentView("login");
		setSelectedProject(null);
	};

	const handleNavigate = (
		view: string,
		data?: any,
		readOnly: boolean = false,
	) => {
		setCurrentView(view);
		if (view === "project-detail") {
			setSelectedProject(data);
			setIsProjectReadOnly(readOnly);
		}
	};

	const handleBack = () => {
		setCurrentView("dashboard");
		setSelectedProject(null);
	};

	const contextValue: AppContextType = {
		user,
		setUser,
		projects,
		setProjects,
		users: MOCK_USERS,
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppContext.Provider value={contextValue}>
				{!user ? (
					<Login onLogin={handleLogin} />
				) : (
					<>
						{currentView === "dashboard" &&
							user.role === "manager" && (
								<ManagerDashboard
									onLogout={handleLogout}
									onNavigate={handleNavigate}
								/>
							)}

						{currentView === "dashboard" &&
							user.role === "contributor" && (
								<ContributorDashboard
									onLogout={handleLogout}
									onNavigate={handleNavigate}
								/>
							)}

						{currentView === "project-detail" &&
							selectedProject && (
								<ProjectDetailView
									project={selectedProject}
									onBack={handleBack}
									isReadOnly={isProjectReadOnly}
								/>
							)}
					</>
				)}
			</AppContext.Provider>
		</ThemeProvider>
	);
};

export default AppAi;
