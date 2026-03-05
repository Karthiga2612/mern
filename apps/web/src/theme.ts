import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6C63FF",
      light: "#8B85FF",
      dark: "#4A42DB",
    },
    secondary: {
      main: "#FF6584",
      light: "#FF8FA3",
      dark: "#DB4564",
    },
    success: {
      main: "#00C853",
      light: "#69F0AE",
    },
    error: {
      main: "#FF5252",
      light: "#FF8A80",
    },
    background: {
      default: "#F5F7FF",
      paper: "#FFFFFF",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});

export default theme;