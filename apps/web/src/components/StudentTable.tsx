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
} from "@mui/material";
import {
  SchoolOutlined,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";
import type { Student } from "../types/student";

interface Props {
  students: Student[];
  onToggle: (id: string) => void;
}

const StudentTable = ({ students, onToggle }: Props) => {
  if (students.length === 0) {
    return (
      <Fade in timeout={500}>
        <Paper
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
            Register a student to see them appear here
          </Typography>
        </Paper>
      </Fade>
    );
  }

  return (
    <Fade in timeout={500}>
      <Paper
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Table header banner */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            bgcolor: "#9c9c9c",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={700} color="white">
            Student Directory
          </Typography>
          
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8F9FE" }}>
                <TableCell sx={{ fontWeight: 700, color: "#646465" }}>
                  S.No
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#646465" }}>
                  Student
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#646465" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#646465" }}>
                  Action
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
                  {/* Row number */}
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
                        color: "#757575",
                        fontSize: 13,
                      }}
                    >
                      {index + 1}
                    </Box>
                  </TableCell>

                  {/* Student info */}
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
                            ? "#4ebd73"
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

                  {/* Status chip */}
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
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </TableCell>

                  {/* Toggle switch */}
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
                            color: "#0e8a5b",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              bgcolor: "#56ac70",
                            },
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Fade>
  );
};

export default StudentTable;