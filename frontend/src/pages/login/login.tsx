import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Container,
    Box,
    Alert,
} from "@mui/material";
import { useState } from "react";
import type { LoginResponse } from "./login.types";
import { jwtDecode } from "jwt-decode";
import type { LoginTokenData } from "../../types/token.type";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        setError("");

        await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data: LoginResponse) => {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                const decodedToken: LoginTokenData = jwtDecode(
                    data.accessToken,
                );
                localStorage.setItem("id", decodedToken.sub);
                localStorage.setItem("role", decodedToken.role);

                navigate("/");
            })
            .catch((error) => {
                setError("Something went wrong: " + error.message);
                return;
            });
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

                        <Box component="form">
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setError("");
                                    setEmail(e.target.value);
                                }}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setError("");
                                    setPassword(e.target.value);
                                }}
                                margin="normal"
                                required
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                onClick={handleSubmit}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};
