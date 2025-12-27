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
  Divider,
  Link,
  InputAdornment,
  Alert,
  Snackbar
} from "@mui/material";

import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";

export default function RegisterPage() {
  const router = useRouter();

  // ui state
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, msg: "", type: "error" });

  async function handleSubmit(event) {
    event.preventDefault(); // stop refresh
    setLoading(true);

    const form = new FormData(event.currentTarget);

    const email = String(form.get("email") || "").trim();
    const pass = String(form.get("pass") || "");
    const address = String(form.get("address") || "").trim();
    const telephone = String(form.get("telephone") || "").trim();

    // validate
    if (!email || !pass || !address || !telephone) {
      setToast({ open: true, msg: "Fill in all fields", type: "error" });
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setToast({ open: true, msg: "Enter a valid email", type: "error" });
      setLoading(false);
      return;
    }

    if (pass.length < 3) {
      setToast({ open: true, msg: "Password too short", type: "error" });
      setLoading(false);
      return;
    }

    try {
      // call register api
      const res = await fetch("/api/newregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass, address, telephone })
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ open: true, msg: "Register API error", type: "error" });
        setLoading(false);
        return;
      }

      if (data.data === "email_exists") {
        setToast({ open: true, msg: "Email already exists", type: "error" });
      } else if (data.data === "inserted") {
        setToast({ open: true, msg: "Account created ✅", type: "success" });
        setTimeout(() => router.push("/"), 800);
      } else if (data.data === "missing_fields") {
        setToast({ open: true, msg: "Missing fields", type: "error" });
      } else {
        setToast({ open: true, msg: "Registration failed", type: "error" });
      }
    } catch (e) {
      setToast({ open: true, msg: "Server error. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top, rgba(255,199,44,0.35), rgba(218,41,28,0.10), transparent 70%)",
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: { xs: 2.5, sm: 4 },
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden"
          }}
        >
          {/* top stripe */}
          <Box
            sx={{
              height: 8,
              background: "linear-gradient(90deg, #DA291C, #FFC72C)",
              mb: 3,
              borderRadius: 99
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <PersonAddAltRoundedIcon />
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              Create account
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
            One minute setup. Then you’re ordering like a pro.
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
                )
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="pass"
              type="password"
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeRoundedIcon />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Telephone"
              name="telephone"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneRoundedIcon />
                  </InputAdornment>
                )
              }}
            />

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
                fontWeight: 900
              }}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ textAlign: "center" }}>
              <Link href="/" underline="hover" sx={{ fontWeight: 800 }}>
                Already have an account? Sign in
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
