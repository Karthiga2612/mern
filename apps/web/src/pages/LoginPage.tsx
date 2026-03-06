import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Stack,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  School,
  AutoStories,
} from "@mui/icons-material";
import { loginStudent } from "../api/studentApi";

interface Props {
  onLogin: (token: string) => void;
}

const LoginPage = ({ onLogin }: Props) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginStudent(email, password);
      onLogin(data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#508748",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Left side - branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 6,
        }}
      >
        <Fade in timeout={800}>
          <Stack alignItems="center" spacing={3}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AutoStories sx={{ fontSize: 50, color: "white" }} />
            </Box>
            <Typography
              variant="h3"
              color="white"
              fontWeight={800}
              textAlign="center"
            >
              Student Portal
            </Typography>
            <Typography
              variant="h6"
              color="rgba(255,255,255,0.8)"
              textAlign="center"
              maxWidth={400}
            >
              Manage your students efficiently with our simple dashboard
            </Typography>
          </Stack>
        </Fade>
      </Box>

      {/* Right side - login form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Fade in timeout={600}>
          <Card
            sx={{
              width: "100%",
              maxWidth: 440,
              p: 2,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Header icon */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "#508748",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <School sx={{ fontSize: 30, color: "white" }} />
                </Box>
                <Typography variant="h4" fontWeight={800}>
                  Welcome Back!
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Sign in to continue to dashboard
                </Typography>
              </Box>

              {error && (
                <Fade in>
                  <Alert
                    severity="error"
                    sx={{ mb: 2, borderRadius: 2 }}
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 2.5 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#d3d0d0" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#d3d0d0" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: 16,
                    borderRadius: 3,
                    bgcolor: "#508748",
                    "&:hover": {
                      bgcolor: "rgb(116, 116, 119)",
                    },
                  }}
                >
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </form>

              <Typography textAlign="center" variant="body2" mt={3}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#b3b3b3",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Create one
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
};

export default LoginPage;