'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ManagerPage() {

  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalItemsSold: 0
  });

  React.useEffect(() => {
    async function loadStats() {
      const res = await fetch("/api/manager?action=stats");
      const data = await res.json();
      setStats(data);
    }
    loadStats();
  }, []);

  return (
    <Box sx={{ height: '100vh' }}>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Manager Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', gap: 3, p: 3 }}>

        {/* Total Items Sold */}
        <Box sx={{
          flex: 1,
          border: '2px solid black',
          borderRadius: 3,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontWeight: "bold"
        }}>
          Items Sold: {stats.totalItemsSold}
        </Box>

        {/* Total Revenue */}
        <Box sx={{
          flex: 1,
          border: '2px solid black',
          borderRadius: 3,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontWeight: "bold"
        }}>
          Revenue: €{stats.totalRevenue.toFixed(2)}
        </Box>

        {/* Total Orders */}
        <Box sx={{
          flex: 1,
          border: '2px solid black',
          borderRadius: 3,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontWeight: "bold"
        }}>
          Orders: {stats.totalOrders}
        </Box>
      </Box>
    </Box>
  );
}
