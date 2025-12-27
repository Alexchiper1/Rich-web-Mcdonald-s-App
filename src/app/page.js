"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Divider,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar
} from "@mui/material";

import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

export default function Home() {
  const router = useRouter();

  // ui state
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, msg: "", type: "error" });

  const handleSubmit = async (event) => {
    event.preventDefault(); // stop refresh
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const pass = String(form.get("pass") || "");

    // quick validation
    if (!email || !pass) {
      setToast({ open: true, msg: "Please enter email + password", type: "error" });
      setLoading(false);
      return;
    }

    // call login api
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass }),
      });

      const data = await res.json();

      if (data.valid === true) {
        setToast({ open: true, msg: "Login successful", type: "success" });

        // route by role
        if (data.role === "customer") router.push("/dashboard");
        if (data.role === "manager") router.push("/manager");
      } else {
        setToast({ open: true, msg: "Invalid login details", type: "error" });
      }
    } catch (e) {
      setToast({ open: true, msg: "Server error. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "radial-gradient(circle at top, rgba(255,199,44,0.35), rgba(218,41,28,0.10), transparent 70%)",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: { xs: 2.5, sm: 4 },
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* top stripe */}
          <Box sx={{ height: 8, background: "linear-gradient(90deg, #DA291C, #FFC72C)", mb: 3, borderRadius: 99 }} />

          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Sign in
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
            Order fast. Track sales. Clean dashboards.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="pass"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass((s) => !s)} edge="end">
                      {showPass ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
              <FormControlLabel control={<Checkbox color="secondary" />} label="Remember me" />
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                customer@test.com pass: 123/ manager@test.com pass:123
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.2,
                boxShadow: "0 10px 25px rgba(218,41,28,0.25)",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ textAlign: "center" }}>
              <Link href="/newregister" underline="hover" sx={{ fontWeight: 700 }}>
                Don&apos;t have an account? Sign up
              </Link>
            </Box>
          </Box>
        </Paper>

        <Snackbar
          open={toast.open}
          autoHideDuration={2500}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
        >
          <Alert severity={toast.type} variant="filled">
            {toast.msg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
