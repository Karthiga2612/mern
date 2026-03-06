import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import {
  People,
  CheckCircle,
  Cancel,
  Refresh,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import StudentTable from "../components/StudentTable";
import { getAllStudents, toggleStudentStatus } from "../api/studentApi";
import type { Student } from "../types/student";

interface Props {
  onLogout: () => void;
}

const DashboardPage = ({ onLogout }: Props) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

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
    icon: <People sx={{ fontSize: 32 }} />,
    color: "#6C63FF",
  },
  {
    title: "Active Students",
    value: active,
    icon: <CheckCircle sx={{ fontSize: 32 }} />,
    color: "#00C853",
  },
  {
    title: "Inactive Students",
    value: inactive,
    icon: <Cancel sx={{ fontSize: 32 }} />,
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
        <Refresh
          sx={{
            fontSize: 40,
            color: "#acacac",
            animation: "spin 1s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
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
        {/* Welcome banner */}
          <Card
            sx={{
              mb: 4,
              borderRadius: 4,
              overflow: "hidden",
              bgcolor: "#9c9c9c",
              boxShadow: "0 8px 32px rgba(214, 214, 214, 0.3)",
            }}
          >
            <CardContent sx={{ py: 4, px: 4 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                {/* Left: greeting */}
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
                    sx={{ color: "rgba(255,255,255,0.85)" }}
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
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "all 0.35s ease",
                    cursor: "default",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: `0 12px 35px ${card.color}`,
                    },
                  }}
                >


                  <CardContent sx={{ p: 3 }}>
                    {/* Top row: title and icon */}
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

                      {/* Icon circle */}
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "16px",
                          bgcolor:card.color,
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

        {/* Student table */}
        <StudentTable students={students} onToggle={handleToggle} />
      </Container>
    </Box>
  );
};

export default DashboardPage;