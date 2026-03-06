import { useState } from "react";
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
  MenuBook,
  Title,
  Description,
  Person,
  AccessTime,
  Close,
} from "@mui/icons-material";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    description: string,
    instructor: string,
    duration: number
  ) => Promise<void>;
}

const AddCourseDialog = ({ open, onClose, onAdd }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setInstructor("");
    setDuration("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onAdd(title, description, instructor, Number(duration));
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add course");
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
          background: "linear-gradient(135deg, #6C63FF 0%, #3F51B5 100%)",
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <MenuBook sx={{ color: "white", fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} color="white">
            Add New Course
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
                  <Title sx={{ color: "#6C63FF" }} />
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
                  <Description sx={{ color: "#6C63FF" }} />
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
                      <Person sx={{ color: "#6C63FF" }} />
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
                      <AccessTime sx={{ color: "#6C63FF" }} />
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
              background: "linear-gradient(135deg, #6C63FF 0%, #3F51B5 100%)",
              boxShadow: "0 4px 15px rgba(108,99,255,0.3)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #5A52DB 0%, #303F9F 100%)",
              },
            }}
          >
            {loading ? "Adding…" : "Add Course"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCourseDialog;