import { AppBar, Toolbar, Typography, Button, Box, } from "@mui/material";
import { Logout, School, } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Props {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "#2ed97b",
        py: 0.5,
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <School sx={{ fontSize: 24, color: "white" }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              Student Dashboard
            </Typography>
          </Box>
        </Box>

        {/* Logout button */}
        <Button
          color="inherit"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1,
            bgcolor: "rgba(255,255,255,0.15)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.25)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;