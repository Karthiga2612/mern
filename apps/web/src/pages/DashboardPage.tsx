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
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
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
  const [refreshing, setRefreshing] = useState(false);

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
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
  const inactivePercent = total > 0 ? Math.round((inactive / total) * 100) : 0;

  const stats = [
    {
      title: "Total Students",
      value: total,
      icon: <People sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #6C63FF 0%, #8B85FF 100%)",
      lightBg: "#EEEDFF",
      shadowColor: "rgba(108,99,255,0.3)",
      percent: 100,
      trend: "all",
      trendIcon: <School sx={{ fontSize: 16 }} />,
    },
    {
      title: "Active Students",
      value: active,
      icon: <CheckCircle sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #00C853 0%, #69F0AE 100%)",
      lightBg: "#E6F9ED",
      shadowColor: "rgba(0,200,83,0.3)",
      percent: activePercent,
      trend: "up",
      trendIcon: <ArrowUpward sx={{ fontSize: 16 }} />,
    },
    {
      title: "Inactive Students",
      value: inactive,
      icon: <Cancel sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #FF5252 0%, #FF8A80 100%)",
      lightBg: "#FFF0F0",
      shadowColor: "rgba(255,82,82,0.3)",
      percent: inactivePercent,
      trend: "down",
      trendIcon: <ArrowDownward sx={{ fontSize: 16 }} />,
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
          background: "linear-gradient(135deg, #F5F7FF 0%, #E8E6FF 100%)",
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#F5F7FF" }}>
      <Navbar onLogout={onLogout} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome banner */}
        <Fade in timeout={400}>
          <Card
            sx={{
              mb: 4,
              borderRadius: 4,
              overflow: "hidden",
              background: "linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)",
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
                {/* Left: greeting */}
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

                {/* Right: stats summary */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    icon={<TrendingUp />}
                    label={`${activePercent}% Active Rate`}
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
                        transition: "all 0.5s ease",
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

        {/* Stats cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((card, index) => (
            <Grid item xs={12} sm={4} key={card.title}>
              <Fade in timeout={600 + index * 200}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "all 0.35s ease",
                    cursor: "default",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: `0 12px 35px ${card.shadowColor}`,
                    },
                  }}
                >
                  {/* Gradient top strip */}
                  <Box
                    sx={{
                      height: 5,
                      background: card.gradient,
                    }}
                  />

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
                          background: card.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          boxShadow: `0 4px 14px ${card.shadowColor}`,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "rotate(10deg) scale(1.1)",
                          },
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

                    {/* Trend badge */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mt={1}
                      mb={2}
                    >
                      <Chip
                        icon={card.trendIcon}
                        label={`${card.percent}%`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: 12,
                          height: 26,
                          bgcolor:
                            card.trend === "up"
                              ? "#E6F9ED"
                              : card.trend === "down"
                              ? "#FFF0F0"
                              : "#EEEDFF",
                          color:
                            card.trend === "up"
                              ? "#00C853"
                              : card.trend === "down"
                              ? "#FF5252"
                              : "#6C63FF",
                          "& .MuiChip-icon": {
                            color:
                              card.trend === "up"
                                ? "#00C853"
                                : card.trend === "down"
                                ? "#FF5252"
                                : "#6C63FF",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        of total students
                      </Typography>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {/* Progress bar */}
                    <Box>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mb={0.5}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Progress
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          sx={{
                            background: card.gradient,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {card.percent}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={card.percent}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: card.lightBg,
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            background: card.gradient,
                          },
                        }}
                      />
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
              overflow: "hidden",
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
                {/* Registered */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ py: 1 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      bgcolor: "#EEEDFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <School sx={{ color: "#6C63FF", fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Registered
                    </Typography>
                    <Typography variant="h6" fontWeight={800} lineHeight={1}>
                      {total}
                    </Typography>
                  </Box>
                </Stack>

                {/* Active */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ py: 1 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      bgcolor: "#E6F9ED",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle sx={{ color: "#00C853", fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Active Now
                    </Typography>
                    <Typography variant="h6" fontWeight={800} lineHeight={1}>
                      {active}
                    </Typography>
                  </Box>
                </Stack>

                {/* Inactive */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ py: 1 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      bgcolor: "#FFF0F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Cancel sx={{ color: "#FF5252", fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Inactive
                    </Typography>
                    <Typography variant="h6" fontWeight={800} lineHeight={1}>
                      {inactive}
                    </Typography>
                  </Box>
                </Stack>

                {/* Active Rate */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ py: 1 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      bgcolor: "#FFF8E1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp sx={{ color: "#FFA000", fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Active Rate
                    </Typography>
                    <Typography variant="h6" fontWeight={800} lineHeight={1}>
                      {activePercent}%
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Fade>

        {/* Student table */}
        <StudentTable students={students} onToggle={handleToggle} />
      </Container>
    </Box>
  );
};

export default DashboardPage;