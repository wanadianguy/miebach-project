import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import { Login } from "./pages/login/login";
import { Dashboard } from "./pages/dashboard/dashboard";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "./themes";
import AppAi from "./whole-project-material";
import { ProjectDetailView } from "./pages/project-detail-view/project-detail-view";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/project/:id" element={<ProjectDetailView />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/ai" element={<AppAi />} />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>,
);
