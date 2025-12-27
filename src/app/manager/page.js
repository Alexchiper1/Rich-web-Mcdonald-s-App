"use client";

import * as React from "react";
import Link from "next/link";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from "@mui/material";

import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import { BarChart } from "@mui/x-charts/BarChart";

import { logout } from "../utils/logout";

export default function ManagerPage() {
  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalItemsSold: 0,
    avgOrderValue: 0
  });

  const [graphData, setGraphData] = React.useState([]);
  const [topItems, setTopItems] = React.useState([]);
  const [recent, setRecent] = React.useState([]);

  React.useEffect(() => {
    async function loadAll() {
      const s = await fetch("/api/manager?action=stats").then(r => r.json());
      const g = await fetch("/api/manager?action=salesGraph").then(r => r.json());
      const t = await fetch("/api/manager?action=topItems").then(r => r.json());
      const rec = await fetch("/api/manager?action=recent").then(r => r.json());

      setStats(s);
      setGraphData(Array.isArray(g) ? g : []);
      setTopItems(Array.isArray(t) ? t : []);
      setRecent(Array.isArray(rec) ? rec : []);
    }
    loadAll();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, rgba(255,199,44,0.20), transparent 40%)" }}>
      <AppBar position="sticky" elevation={6} sx={{ background: "linear-gradient(90deg, #DA291C, #b21c13)" }}>
        <Toolbar>

          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Manager Dashboard
            </Typography>
          </Box>

          <Chip label="Managers Only" color="secondary" sx={{ fontWeight: 900, mr: 1 }} />

          {/* Logout (RIGHT) */}
          <Button
            color="inherit"
            startIcon={<ExitToAppRoundedIcon />}
            onClick={logout}
            sx={{ fontWeight: 900 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, md: 3 }, display: "grid", gap: 2.2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
        <Paper elevation={10} sx={{ p: 2.2, border: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography sx={{ fontWeight: 900, opacity: 0.75 }}>Orders</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 28 }}>{stats.totalOrders}</Typography>
        </Paper>

        <Paper elevation={10} sx={{ p: 2.2, border: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography sx={{ fontWeight: 900, opacity: 0.75 }}>Revenue</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 28 }}>€{Number(stats.totalRevenue).toFixed(2)}</Typography>
        </Paper>

        <Paper elevation={10} sx={{ p: 2.2, border: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography sx={{ fontWeight: 900, opacity: 0.75 }}>Items Sold</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 28 }}>{stats.totalItemsSold}</Typography>
        </Paper>

        <Paper elevation={10} sx={{ p: 2.2, border: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography sx={{ fontWeight: 900, opacity: 0.75 }}>Avg Order</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 28 }}>€{Number(stats.avgOrderValue).toFixed(2)}</Typography>
        </Paper>
      </Box>

      <Box sx={{ px: { xs: 2, md: 3 }, pb: 3, display: "grid", gap: 2.2, gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" } }}>
        <Paper elevation={10} sx={{ p: 2.2, border: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
            Orders by Day
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <BarChart
            xAxis={[{ data: graphData.map((x) => x.label), scaleType: "band" }]}
            series={[{ data: graphData.map((x) => x.totalOrders), label: "Total Orders" }]}
            height={320}
          />
        </Paper>

        <Paper elevation={10} sx={{ p: 2.2, border: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
            Top Items
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {topItems.map((it, i) => (
            <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontWeight: 800 }}>{it.name}</Typography>
              <Chip label={it.count} color="secondary" sx={{ fontWeight: 900 }} />
            </Box>
          ))}
        </Paper>
      </Box>

      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        <Paper elevation={10} sx={{ p: 2.2, border: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
            Recent Orders
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Items</b></TableCell>
                <TableCell><b>Total</b></TableCell>
                <TableCell><b>Date</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.map((o, i) => (
                <TableRow key={i}>
                  <TableCell>{o.email}</TableCell>
                  <TableCell>{Array.isArray(o.items) ? o.items.length : 0}</TableCell>
                  <TableCell>€{Number(o.total || 0).toFixed(2)}</TableCell>
                  <TableCell>{o.date ? new Date(o.date).toLocaleString("en-IE") : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}
