import { forwardRef } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Chip,
  Avatar,
  Box,
  Typography,
  Fade,
  Tooltip,
  IconButton,
  Stack,
} from "@mui/material";
import {
  SchoolOutlined,
  ToggleOn,
  ToggleOff,
  Edit,
  Delete,
} from "@mui/icons-material";
import type { Student } from "../types/student";

interface Props {
  students: Student[];
  onToggle: (id: string) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

// Wrapper that accepts ref from Fade
const TableContent = forwardRef<HTMLDivElement, Props>(
  ({ students, onToggle, onEdit, onDelete }, ref) => {
    if (students.length === 0) {
      return (
        <Paper
          ref={ref}
          sx={{
            p: 8,
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              bgcolor: "#F5F7FF",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <SchoolOutlined sx={{ fontSize: 50, color: "#6C63FF" }} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            No Students Yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Click "Add Student" to get started
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper
        ref={ref}
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            background: "linear-gradient(135deg, #00C853 0%, #69F0AE 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={700} color="white">
            Student Directory
          </Typography>
         <Chip
  label={`${students.length} total`}
  size="small"
  sx={{
    bgcolor: "rgba(255,255,255,0.2)",
    color: "white",
    fontWeight: 600,
  }}
/>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8F9FE" }}>
                <TableCell sx={{ fontWeight: 700, color: "#6C63FF" }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#6C63FF" }}>
                  Student
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#6C63FF" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#6C63FF" }}>
                  Toggle
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: "#6C63FF" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.map((student, index) => (
                <TableRow
                  key={student._id}
                  sx={{
                    "&:nth-of-type(even)": { bgcolor: "#FAFBFF" },
                    "&:hover": { bgcolor: "#F0F1FF" },
                    transition: "background 0.2s ease",
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "8px",
                        bgcolor: "#F0F1FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: "#6C63FF",
                        fontSize: 13,
                      }}
                    >
                      {index + 1}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          background: student.isActive
                            ? "linear-gradient(135deg, #6C63FF, #FF6584)"
                            : "#E0E0E0",
                          transition: "all 0.3s ease",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {student.email.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {student.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Student Account
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={
                        student.isActive ? (
                          <ToggleOn sx={{ fontSize: "18px !important" }} />
                        ) : (
                          <ToggleOff sx={{ fontSize: "18px !important" }} />
                        )
                      }
                      label={student.isActive ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        bgcolor: student.isActive ? "#E8F5E9" : "#FFEBEE",
                        color: student.isActive ? "#2E7D32" : "#C62828",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Tooltip
                      title={
                        student.isActive
                          ? "Click to deactivate"
                          : "Click to activate"
                      }
                      arrow
                    >
                      <Switch
                        checked={student.isActive}
                        onChange={() => onToggle(student._id)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#6C63FF",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              bgcolor: "#6C63FF",
                            },
                        }}
                      />
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                    >
                      <Tooltip title="Edit student" arrow>
                        <IconButton
                          onClick={() => onEdit(student)}
                          sx={{
                            bgcolor: "#FFF3E0",
                            color: "#FF9800",
                            "&:hover": {
                              bgcolor: "#FFE0B2",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          size="small"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete student" arrow>
                        <IconButton
                          onClick={() => onDelete(student)}
                          sx={{
                            bgcolor: "#FFEBEE",
                            color: "#FF5252",
                            "&:hover": {
                              bgcolor: "#FFCDD2",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          size="small"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
);

// Main component that wraps with Fade
const StudentTable = (props: Props) => {
  return (
    <Fade in timeout={500}>
      <TableContent {...props} />
    </Fade>
  );
};

export default StudentTable;