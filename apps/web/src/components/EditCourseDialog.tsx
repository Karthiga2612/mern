import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Fade,
  Grid,
} from "@mui/material";
import {
  Edit,
  Title,
  Description,
  Person,
  AccessTime,
  Close,
} from "@mui/icons-material";
import type { Course } from "../types/course";

interface Props {
  open: boolean;
  course: Course | null;
  onClose: () => void;
  onEdit: (
    id: string,
    title: string,
    description: string,
    instructor: string,
    duration: number
  ) => Promise<void>;
}

const EditCourseDialog = ({ open, course, onClose, onEdit }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setInstructor(course.instructor);
      setDuration(String(course.duration));
      setError("");
    }
  }, [course]);

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    setError("");
    setLoading(true);

    try {
      await onEdit(course._id, title, description, instructor, Number(duration));
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)",
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Edit sx={{ color: "white", fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} color="white">
            Edit Course
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 3, py: 3 }}>
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

          <TextField
            fullWidth
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Title sx={{ color: "#FF9800" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={3}
            sx={{ mb: 2.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description sx={{ color: "#FF9800" }} />
                </InputAdornment>
              ),
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instructor"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#FF9800" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (hours)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime sx={{ color: "#FF9800" }} />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1 },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 3,
              borderColor: "#E0E0E0",
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 3,
              px: 3,
              background: "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)",
              boxShadow: "0 4px 15px rgba(255,152,0,0.3)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #F57C00 0%, #FFA726 100%)",
              },
            }}
          >
            {loading ? "Updating…" : "Update Course"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCourseDialog;