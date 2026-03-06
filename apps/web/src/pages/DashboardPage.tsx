import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import {
  People,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import StudentTable from "../components/StudentTable";
import { getAllStudents, toggleStudentStatus, createStudent } from "../api/studentApi";
import type { Student } from "../types/student";

interface Props {
  onLogout: () => void;
}

const DashboardPage = ({ onLogout }: Props) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

const handleCreate = async () => {
  try {
    await createStudent({ email, password });

    fetchStudents();   // reload students from backend

    setEmail("");
    setPassword("");
    setShowForm(false);

  } catch (err) {
    console.log(err);
  }
};

  const handleToggle = async (id: string) => {
    try {
      await toggleStudentStatus(id);
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (error) {
      console.error("Toggle failed", error);
    }
  };

  const total = students.length;
  const active = students.filter((s) => s.isActive).length;
  const inactive = students.filter((s) => !s.isActive).length;

  const stats = [
    {
      title: "Total Students",
      value: total,
      icon: <People sx={{ fontSize: 31 }} />,
      color: "#6C63FF",
    },
    {
      title: "Active Students",
      value: active,
      icon: <CheckCircle sx={{ fontSize: 31 }} />,
      color: "#00C853",
    },
    {
      title: "Inactive Students",
      value: inactive,
      icon: <Cancel sx={{ fontSize: 31 }} />,
      color: "#FF5252",
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
          bgcolor: "#d3d0d0",
        }}
      >
        <Typography variant="h6" color="text.secondary" fontWeight={600}>
          Loading dashboard…
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F5F7FF" }}>
      <Navbar onLogout={onLogout} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card
          sx={{
            mb: 4,
            overflow: "hidden",
            bgcolor: "#508748",
          }}
        >
          <CardContent sx={{ py: 4, px: 4 }}>
            <Stack
              direction="column"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="white"
                  >
                    Dashboard Overview
                  </Typography>
                </Stack>
                <Typography
                  variant="body1"
                  color="white"
                >
                  Monitor and manage all student accounts from one place
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Stats cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((card) => (
            <Grid item xs={12} sm={4} key={card.title}>
              <Card
                sx={{
                  overflow: "hidden",
                  transition: "all 0.35s ease",
                  cursor: "default",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 35px ${card.color}`,
                  },
                }}
              >


                <CardContent sx={{ p: 4 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{ letterSpacing: 0.5 }}
                      >
                        {card.title}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "16px",
                        bgcolor: card.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Stack>

                  {/* Big number */}
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    sx={{ lineHeight: 1 }}
                  >
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {showForm && (
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              label="Student Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button variant="contained" onClick={handleCreate}>
              OK
            </Button>

            <Button
              variant="outlined"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </Box>
        )}
        <StudentTable
          students={students}
          onToggle={handleToggle}
          onAddClick={() => setShowForm(true)}
        />
      </Container>
    </Box>
  );
};

export default DashboardPage;