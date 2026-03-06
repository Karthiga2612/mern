import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { DeleteForever, WarningAmber } from "@mui/icons-material";
import type { Student } from "../types/student";

interface Props {
  open: boolean;
  student: Student | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({
  open,
  student,
  loading,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      {/* Red warning header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF5252 0%, #FF8A80 100%)",
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
          Delete Student?
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={1}>
          You are about to delete
        </Typography>
        {student && (
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
            {student.email}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" mt={2}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 3,
            px: 4,
            borderColor: "#E0E0E0",
            color: "text.secondary",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          startIcon={<DeleteForever />}
          sx={{
            borderRadius: 3,
            px: 4,
            background: "linear-gradient(135deg, #FF5252 0%, #FF8A80 100%)",
            boxShadow: "0 4px 15px rgba(255,82,82,0.3)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #D32F2F 0%, #FF5252 100%)",
            },
          }}
        >
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;