import { useState } from "react";
import {
  Dialog,
//   DialogTitle,
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
  PersonAdd,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Close,
} from "@mui/icons-material";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (email: string, password: string) => Promise<void>;
}

const AddStudentDialog = ({ open, onClose, onAdd }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
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
      await onAdd(email, password);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add student");
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
          background: "linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)",
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <PersonAdd sx={{ color: "white", fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} color="white">
            Add New Student
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
                  <Email sx={{ color: "#6C63FF" }} />
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#6C63FF" }} />
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
              background: "linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)",
              boxShadow: "0 4px 15px rgba(108,99,255,0.3)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #5A52DB 0%, #DB4564 100%)",
              },
            }}
          >
            {loading ? "Adding…" : "Add Student"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddStudentDialog;