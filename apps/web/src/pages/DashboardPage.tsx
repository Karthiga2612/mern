import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Fade,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  People,
  CheckCircle,
  Cancel,
  TrendingUp,
  Refresh,
  School,
  WavingHand,
  ArrowUpward,
  ArrowDownward,
  PersonAdd,
  Circle,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import StudentTable from "../components/StudentTable";
import AddStudentDialog from "../components/AddStudentDialog";
import EditStudentDialog from "../components/EditStudentDialog";
import DeleteConfirmDialog from "../components/DeleteDialog";
import CourseSection from "../components/CourseSection";
import {
  getAllStudents,
  toggleStudentStatus,
  registerStudent,
  updateStudent,
  deleteStudent,
} from "../api/studentApi";
import type { Student } from "../types/student";

interface Props {
  onLogout: () => void;
}

const DashboardPage = ({ onLogout }: Props) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  const showSnackbar = (message: string) => {
    setSnackbar({ open: true, message });
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

  const handleAdd = async (email: string, password: string) => {
    const newStudent = await registerStudent(email, password);
    setStudents((prev) => [...prev, newStudent]);
    showSnackbar("Student added successfully!");
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setEditOpen(true);
  };

  const handleEditSubmit = async (
    id: string,
    email: string,
    password?: string
  ) => {
    const result = await updateStudent(id, email, password);
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? result.student : s))
    );
    showSnackbar("Student updated successfully!");
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    setDeleteLoading(true);
    try {
      await deleteStudent(selectedStudent._id);
      setStudents((prev) =>
        prev.filter((s) => s._id !== selectedStudent._id)
      );
      showSnackbar("Student deleted successfully!");
      setDeleteOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const total = students.length;
  const active = students.filter((s) => s.isActive).length;
  const inactive = students.filter((s) => !s.isActive).length;
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
  const inactivePercent = total > 0 ? Math.round((inactive / total) * 100) : 0;

  const stats = [
    {
      title: "Total Students",
      value: total,
      icon: <People sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #6C63FF 0%, #8B85FF 100%)",
      bgGradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
      accentColor: "#6C63FF",
      lightColor: "#EEEDFF",
      shadowColor: "rgba(108,99,255,0.15)",
      hoverShadow: "rgba(108,99,255,0.35)",
      percent: 100,
      trendLabel: "All registered",
      trendIcon: <School sx={{ fontSize: 14 }} />,
      trendColor: "#6C63FF",
      trendBg: "#EEEDFF",
    },
    {
      title: "Active Students",
      value: active,
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #00C853 0%, #69F0AE 100%)",
      bgGradient: "linear-gradient(135deg, #F0FFF4 0%, #DCFCE7 100%)",
      accentColor: "#00C853",
      lightColor: "#E6F9ED",
      shadowColor: "rgba(0,200,83,0.15)",
      hoverShadow: "rgba(0,200,83,0.35)",
      percent: activePercent,
      trendLabel: `${activePercent}% active`,
      trendIcon: <ArrowUpward sx={{ fontSize: 14 }} />,
      trendColor: "#00C853",
      trendBg: "#E6F9ED",
    },
    {
      title: "Inactive Students",
      value: inactive,
      icon: <Cancel sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #FF5252 0%, #FF8A80 100%)",
      bgGradient: "linear-gradient(135deg, #FFF5F5 0%, #FEE2E2 100%)",
      accentColor: "#FF5252",
      lightColor: "#FFF0F0",
      shadowColor: "rgba(255,82,82,0.15)",
      hoverShadow: "rgba(255,82,82,0.35)",
      percent: inactivePercent,
      trendLabel: `${inactivePercent}% inactive`,
      trendIcon: <ArrowDownward sx={{ fontSize: 14 }} />,
      trendColor: "#FF5252",
      trendBg: "#FFF0F0",
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
          background: "linear-gradient(135deg, #F0FFF4 0%, #DCFCE7 100%)",
        }}
      >
        <Refresh
          sx={{
            fontSize: 40,
            color: "#6C63FF",
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F0FFF4 0%, #DCFCE7 100%)",
      }}
    >
      <Navbar onLogout={onLogout} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome banner */}
        <Fade in timeout={400}>
          <Card
            sx={{
              mb: 4,
              borderRadius: 4,
              overflow: "hidden",
              background: "linear-gradient(135deg, #00C853 0%, #69F0AE 100%)",
              boxShadow: "0 8px 32px rgba(108,99,255,0.3)",
            }}
          >
            <CardContent sx={{ py: 4, px: 4 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <WavingHand
                      sx={{
                        fontSize: 28,
                        color: "#FFD54F",
                        animation: "wave 1.5s ease-in-out infinite",
                        "@keyframes wave": {
                          "0%, 100%": { transform: "rotate(0deg)" },
                          "25%": { transform: "rotate(20deg)" },
                          "50%": { transform: "rotate(-10deg)" },
                          "75%": { transform: "rotate(15deg)" },
                        },
                      }}
                    />
                    <Typography variant="h4" fontWeight={800} color="white">
                      Dashboard Overview
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                    Monitor and manage all student accounts from one place
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => setAddOpen(true)}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.2,
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 700,
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.35)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    Add Student
                  </Button>

                  <Chip
                    icon={<TrendingUp />}
                    label={`${activePercent}% Active`}
                    sx={{
                      py: 2.5,
                      px: 1,
                      fontWeight: 700,
                      fontSize: 14,
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      backdropFilter: "blur(10px)",
                      "& .MuiChip-icon": { color: "#69F0AE" },
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />

                  <Tooltip title="Refresh data" arrow>
                    <IconButton
                      onClick={handleRefresh}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.3)",
                          transform: "rotate(180deg)",
                        },
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <Refresh
                        sx={{
                          animation: refreshing
                            ? "spin 1s linear infinite"
                            : "none",
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Fade>

        {/* Stats cards - new glassmorphism style */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((card, index) => (
            <Grid item xs={12} sm={4} key={card.title}>
              <Fade in timeout={600 + index * 200}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "visible",
                    background: card.bgGradient,
                    border: `1px solid ${card.lightColor}`,
                    boxShadow: `0 4px 24px ${card.shadowColor}`,
                    cursor: "default",
                    position: "relative",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: `0 16px 40px ${card.hoverShadow}`,
                      border: `1px solid ${card.accentColor}40`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Top row */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2.5}
                    >
                      {/* Icon pill */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          background: card.gradient,
                          borderRadius: "14px",
                          px: 2,
                          py: 1,
                          color: "white",
                          boxShadow: `0 4px 12px ${card.shadowColor}`,
                          transition:
                            "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: `0 6px 20px ${card.hoverShadow}`,
                          },
                        }}
                      >
                        {card.icon}
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="white"
                        >
                          {card.title}
                        </Typography>
                      </Box>

                      {/* Trend pill */}
                      <Chip
                        icon={card.trendIcon}
                        label={card.trendLabel}
                        size="small"
                        sx={{
                          height: 28,
                          fontWeight: 600,
                          fontSize: 11,
                          bgcolor: "white",
                          color: card.trendColor,
                          border: `1px solid ${card.trendBg}`,
                          "& .MuiChip-icon": {
                            color: card.trendColor,
                            ml: 0.5,
                          },
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      />
                    </Stack>

                    {/* Big number with ring */}
                    <Stack
                      direction="row"
                      alignItems="flex-end"
                      spacing={2}
                      mb={2.5}
                    >
                      {/* Circular progress ring */}
                      <Box
                        sx={{
                          position: "relative",
                          width: 64,
                          height: 64,
                        }}
                      >
                        {/* Background ring */}
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: `4px solid ${card.lightColor}`,
                          }}
                        />
                        {/* Progress ring */}
                        <svg
                          width="64"
                          height="64"
                          style={{
                            position: "absolute",
                            transform: "rotate(-90deg)",
                          }}
                        >
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke={card.accentColor}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${(card.percent / 100) * 176} 176`}
                            style={{
                              transition:
                                "stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          />
                        </svg>
                        {/* Center text */}
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontWeight={800}
                            sx={{ color: card.accentColor, fontSize: 13 }}
                          >
                            {card.percent}%
                          </Typography>
                        </Box>
                      </Box>

                      {/* Value and label */}
                      <Box>
                        <Typography
                          variant="h3"
                          fontWeight={800}
                          sx={{
                            lineHeight: 1,
                            background: card.gradient,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {card.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={500}
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          students
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Bottom bar */}
                    <Box
                      sx={{
                        bgcolor: "white",
                        borderRadius: 3,
                        p: 1.5,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Circle
                            sx={{
                              fontSize: 8,
                              color: card.accentColor,
                              animation:
                                card.percent > 0
                                  ? "pulse 2s ease-in-out infinite"
                                  : "none",
                              "@keyframes pulse": {
                                "0%, 100%": { opacity: 1 },
                                "50%": { opacity: 0.4 },
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            {card.percent > 0 ? "Tracking" : "No data"}
                          </Typography>
                        </Stack>

                        {/* Mini bar chart */}
                        <Stack direction="row" spacing={0.3} alignItems="end">
                          {[40, 65, 45, 80, 55, card.percent].map(
                            (h, i) => (
                              <Box
                                key={i}
                                sx={{
                                  width: 4,
                                  height: `${Math.max(h / 5, 3)}px`,
                                  borderRadius: 1,
                                  bgcolor:
                                    i === 5
                                      ? card.accentColor
                                      : `${card.accentColor}30`,
                                  transition:
                                    "height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                                }}
                              />
                            )
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Quick summary bar */}
        <Fade in timeout={1200}>
          <Card
            sx={{
              mb: 4,
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent sx={{ py: 2, px: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", sm: "block" } }}
                  />
                }
                spacing={2}
                justifyContent="space-around"
                alignItems="center"
              >
                {[
                  {
                    label: "Registered",
                    value: total,
                    icon: <School sx={{ color: "#6C63FF", fontSize: 22 }} />,
                    bg: "#EEEDFF",
                  },
                  {
                    label: "Active Now",
                    value: active,
                    icon: (
                      <CheckCircle sx={{ color: "#00C853", fontSize: 22 }} />
                    ),
                    bg: "#E6F9ED",
                  },
                  {
                    label: "Inactive",
                    value: inactive,
                    icon: <Cancel sx={{ color: "#FF5252", fontSize: 22 }} />,
                    bg: "#FFF0F0",
                  },
                  {
                    label: "Active Rate",
                    value: `${activePercent}%`,
                    icon: (
                      <TrendingUp sx={{ color: "#FFA000", fontSize: 22 }} />
                    ),
                    bg: "#FFF8E1",
                  },
                ].map((item) => (
                  <Stack
                    key={item.label}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                      py: 1,
                      px: 1.5,
                      borderRadius: 2,
                      transition:
                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        bgcolor: item.bg,
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        bgcolor: item.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        {item.label}
                      </Typography>
                      <Typography variant="h6" fontWeight={800} lineHeight={1}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Fade>

        {/* Student table */}
        <StudentTable
          students={students}
          onToggle={handleToggle}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {/* Course section */}
        <CourseSection />
      </Container>

      {/* Student dialogs */}
      <AddStudentDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />

      <EditStudentDialog
        open={editOpen}
        student={selectedStudent}
        onClose={() => {
          setEditOpen(false);
          setSelectedStudent(null);
        }}
        onEdit={handleEditSubmit}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        student={selectedStudent}
        loading={deleteLoading}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedStudent(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: "" })}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 3, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;