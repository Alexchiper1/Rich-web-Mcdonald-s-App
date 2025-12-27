import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#DA291C" },     // McD red
    secondary: { main: "#FFC72C" },   // McD yellow
    background: {
      default: "#fff8e1",
      paper: "#ffffff",
    },
    text: {
      primary: "#1b1b1b",
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: "Inter, system-ui, Arial",
    h5: { fontWeight: 800 },
    button: { fontWeight: 800, letterSpacing: 0.5 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 14 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 20 },
      },
    },
  },
});

export default theme;
