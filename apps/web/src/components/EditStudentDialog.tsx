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
} from "@mui/material";
import {
  Edit,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Close,
} from "@mui/icons-material";
import type { Student } from "../types/student";

interface Props {
  open: boolean;
  student: Student | null;
  onClose: () => void;
  onEdit: (id: string, email: string, password?: string) => Promise<void>;
}

const EditStudentDialog = ({ open, student, onClose, onEdit }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fill the form when a student is selected
  useEffect(() => {
    if (student) {
      setEmail(student.email);
      setPassword("");
      setShowPassword(false);
      setError("");
    }
  }, [student]);

  const handleClose = () => {
    setError("");
    setPassword("");
    onClose();
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!student) return;

    setError("");
    setLoading(true);

    try {
      await onEdit(student._id, email, password || undefined);
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update student");
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
      {/* Gradient header */}
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
            Edit Student
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
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#FF9800" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="New Password (leave blank to keep current)"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Only fill this if you want to change the password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#FF9800" }} />
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
            {loading ? "Updating…" : "Update Student"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditStudentDialog;