import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Switch,
  Fade,
  Button,
  Paper,
  Snackbar,
  Alert,
  Avatar,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  MenuBook,
  Edit,
  Delete,
  Add,
  Person,
  AccessTime,
  Publish,
  Unpublished,
  LibraryBooks,
  WarningAmber,
  DeleteForever,
  Circle,
  AutoStories,
  BookmarkAdded,
  Drafts,
} from "@mui/icons-material";
import type { Course } from "../types/course";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublish,
} from "../api/courseApi";
import AddCourseDialog from "./AddCourseDialog";
import EditCourseDialog from "./EditCourseDialog";

const CourseSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbar({ open: true, message });
  };

  const handleAdd = async (
    title: string,
    description: string,
    instructor: string,
    duration: number
  ) => {
    const newCourse = await createCourse(
      title,
      description,
      instructor,
      duration
    );
    setCourses((prev) => [newCourse, ...prev]);
    showSnackbar("Course added successfully!");
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleCoursePublish(id);
      setCourses((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isPublished: !c.isPublished } : c
        )
      );
    } catch (error) {
      console.error("Toggle failed", error);
    }
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setEditOpen(true);
  };

  const handleEditSubmit = async (
    id: string,
    title: string,
    description: string,
    instructor: string,
    duration: number
  ) => {
    const result = await updateCourse(
      id,
      title,
      description,
      instructor,
      duration
    );
    setCourses((prev) =>
      prev.map((c) => (c._id === id ? result.course : c))
    );
    showSnackbar("Course updated successfully!");
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCourse) return;

    setDeleteLoading(true);
    try {
      await deleteCourse(selectedCourse._id);
      setCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
      showSnackbar("Course deleted successfully!");
      setDeleteOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const published = courses.filter((c) => c.isPublished).length;
  const draft = courses.filter((c) => !c.isPublished).length;
  const totalHours = courses.reduce((sum, c) => sum + c.duration, 0);
  const publishedPercent =
    courses.length > 0 ? Math.round((published / courses.length) * 100) : 0;

  return (
    <Box sx={{ mt: 5 }}>
      {/* Section header */}
      <Fade in timeout={400}>
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            overflow: "hidden",
            background: "linear-gradient(135deg, #3F51B5 0%, #6C63FF 100%)",
            boxShadow: "0 8px 32px rgba(63,81,181,0.3)",
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
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  mb={1}
                >
                  <AutoStories
                    sx={{
                      color: "#FFD54F",
                      fontSize: 28,
                      animation: "float 3s ease-in-out infinite",
                      "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0)" },
                        "50%": { transform: "translateY(-4px)" },
                      },
                    }}
                  />
                  <Typography variant="h4" fontWeight={800} color="white">
                    Course Management
                  </Typography>
                </Stack>
                <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
                  Create, publish, and manage courses for your students
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  icon={<BookmarkAdded />}
                  label={`${published} Published`}
                  sx={{
                    py: 2.5,
                    px: 1,
                    fontWeight: 700,
                    fontSize: 13,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    "& .MuiChip-icon": { color: "#69F0AE" },
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
                <Chip
                  icon={<Drafts />}
                  label={`${draft} Draft`}
                  sx={{
                    py: 2.5,
                    px: 1,
                    fontWeight: 700,
                    fontSize: 13,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    "& .MuiChip-icon": { color: "#FFD54F" },
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddOpen(true)}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 700,
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "none",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.35)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    },
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Add Course
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Fade>

      {/* Course stats mini cards */}
      <Fade in timeout={600}>
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
                  label: "Total Courses",
                  value: courses.length,
                  icon: (
                    <MenuBook sx={{ color: "#3F51B5", fontSize: 22 }} />
                  ),
                  bg: "#E8EAF6",
                },
                {
                  label: "Published",
                  value: published,
                  icon: (
                    <BookmarkAdded sx={{ color: "#00C853", fontSize: 22 }} />
                  ),
                  bg: "#E6F9ED",
                },
                {
                  label: "Drafts",
                  value: draft,
                  icon: <Drafts sx={{ color: "#FFA000", fontSize: 22 }} />,
                  bg: "#FFF8E1",
                },
                {
                  label: "Total Hours",
                  value: `${totalHours}h`,
                  icon: (
                    <AccessTime sx={{ color: "#6C63FF", fontSize: 22 }} />
                  ),
                  bg: "#EEEDFF",
                },
                {
                  label: "Publish Rate",
                  value: `${publishedPercent}%`,
                  icon: (
                    <Publish sx={{ color: "#FF6584", fontSize: 22 }} />
                  ),
                  bg: "#FFE8ED",
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
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      lineHeight={1}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Fade>

      {/* Course cards */}
      {courses.length === 0 && !loading ? (
        <Fade in timeout={500}>
          <Paper
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              background:
                "linear-gradient(135deg, #F0FFF4 0%, #DCFCE7 100%)",
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
                boxShadow: "0 4px 20px rgba(108,99,255,0.15)",
              }}
            >
              <LibraryBooks sx={{ fontSize: 50, color: "#6C63FF" }} />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              No Courses Yet
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={3}
            >
              Click "Add Course" to create your first course
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddOpen(true)}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.2,
                background:
                  "linear-gradient(135deg, #3F51B5 0%, #6C63FF 100%)",
                boxShadow: "0 4px 15px rgba(63,81,181,0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #303F9F 0%, #5A52DB 100%)",
                  transform: "translateY(-2px)",
                },
                transition:
                  "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Create First Course
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Fade in timeout={500 + index * 100}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "visible",
                    background: course.isPublished
                      ? "linear-gradient(135deg, #F0FFF4 0%, #DCFCE7 100%)"
                      : "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                    border: `1px solid ${
                      course.isPublished ? "#BBF7D0" : "#FDE68A"
                    }`,
                    boxShadow: course.isPublished
                      ? "0 4px 24px rgba(0,200,83,0.1)"
                      : "0 4px 24px rgba(255,160,0,0.1)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition:
                      "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: course.isPublished
                        ? "0 16px 40px rgba(0,200,83,0.2)"
                        : "0 16px 40px rgba(255,160,0,0.2)",
                      border: `1px solid ${
                        course.isPublished ? "#4ADE80" : "#FBBF24"
                      }`,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Header: status pill + toggle */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                          background: course.isPublished
                            ? "linear-gradient(135deg, #00C853, #69F0AE)"
                            : "linear-gradient(135deg, #FFA000, #FFD54F)",
                          borderRadius: "10px",
                          px: 1.5,
                          py: 0.5,
                          color: "white",
                          boxShadow: course.isPublished
                            ? "0 2px 8px rgba(0,200,83,0.3)"
                            : "0 2px 8px rgba(255,160,0,0.3)",
                        }}
                      >
                        <Circle sx={{ fontSize: 6 }} />
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          fontSize={11}
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </Typography>
                      </Box>

                      <Tooltip
                        title={
                          course.isPublished ? "Unpublish" : "Publish"
                        }
                        arrow
                      >
                        <Switch
                          checked={course.isPublished}
                          onChange={() => handleToggle(course._id)}
                          size="small"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#00C853",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              { bgcolor: "#00C853" },
                          }}
                        />
                      </Tooltip>
                    </Stack>

                    {/* Course icon + title */}
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "14px",
                          background:
                            "linear-gradient(135deg, #3F51B5, #6C63FF)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          boxShadow:
                            "0 4px 12px rgba(63,81,181,0.3)",
                          transition:
                            "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "rotate(5deg) scale(1.1)",
                          },
                        }}
                      >
                        <MenuBook
                          sx={{ color: "white", fontSize: 22 }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.3,
                          }}
                        >
                          {course.title}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={2}
                      sx={{
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.6,
                      }}
                    >
                      {course.description}
                    </Typography>

                    {/* Info row */}
                    <Box
                      sx={{
                        bgcolor: "white",
                        borderRadius: 3,
                        p: 1.5,
                        mb: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        justifyContent="space-between"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.8}
                        >
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              bgcolor: "#E8EAF6",
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#3F51B5",
                            }}
                          >
                            {course.instructor.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography
                            variant="caption"
                            fontWeight={600}
                            noWrap
                            sx={{ maxWidth: 100 }}
                          >
                            {course.instructor}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <AccessTime
                            sx={{
                              fontSize: 14,
                              color: "#6C63FF",
                            }}
                          />
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            color="#6C63FF"
                          >
                            {course.duration}h
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Action buttons */}
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit course" arrow>
                        <IconButton
                          onClick={() => handleEditClick(course)}
                          size="small"
                          sx={{
                            flex: 1,
                            borderRadius: 2.5,
                            bgcolor: "white",
                            color: "#FF9800",
                            border: "1px solid #FFF3E0",
                            boxShadow:
                              "0 2px 8px rgba(255,152,0,0.08)",
                            "&:hover": {
                              bgcolor: "#FFF3E0",
                              transform: "scale(1.03)",
                              border: "1px solid #FFE0B2",
                            },
                            transition:
                              "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete course" arrow>
                        <IconButton
                          onClick={() => handleDeleteClick(course)}
                          size="small"
                          sx={{
                            flex: 1,
                            borderRadius: 2.5,
                            bgcolor: "white",
                            color: "#FF5252",
                            border: "1px solid #FFEBEE",
                            boxShadow:
                              "0 2px 8px rgba(255,82,82,0.08)",
                            "&:hover": {
                              bgcolor: "#FFEBEE",
                              transform: "scale(1.03)",
                              border: "1px solid #FFCDD2",
                            },
                            transition:
                              "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialogs */}
      <AddCourseDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />

      <EditCourseDialog
        open={editOpen}
        course={selectedCourse}
        onClose={() => {
          setEditOpen(false);
          setSelectedCourse(null);
        }}
        onEdit={handleEditSubmit}
      />

      {/* Delete confirmation */}
      <Dialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedCourse(null);
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
      >
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #FF5252 0%, #FF8A80 100%)",
            py: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "rgba(255,255,255,0.2)",
            }}
          >
            <WarningAmber sx={{ fontSize: 36, color: "white" }} />
          </Avatar>
        </Box>

        <DialogContent sx={{ textAlign: "center", px: 3, py: 3 }}>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Delete Course?
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={1}>
            You are about to delete
          </Typography>
          {selectedCourse && (
            <Typography
              variant="body1"
              fontWeight={700}
              sx={{
                bgcolor: "#FFF0F0",
                px: 2,
                py: 1,
                borderRadius: 2,
                display: "inline-block",
                color: "#FF5252",
              }}
            >
              {selectedCourse.title}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" mt={2}>
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1 }}
        >
          <Button
            onClick={() => {
              setDeleteOpen(false);
              setSelectedCourse(null);
            }}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 4,
              borderColor: "#E0E0E0",
              color: "text.secondary",
              transition:
                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                borderColor: "#BDBDBD",
                transform: "translateY(-1px)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={deleteLoading}
            startIcon={<DeleteForever />}
            sx={{
              borderRadius: 3,
              px: 4,
              background:
                "linear-gradient(135deg, #FF5252 0%, #FF8A80 100%)",
              boxShadow: "0 4px 15px rgba(255,82,82,0.3)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #D32F2F 0%, #FF5252 100%)",
                transform: "translateY(-1px)",
              },
              transition:
                "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {deleteLoading ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default CourseSection;