'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { BarChart } from '@mui/x-charts/BarChart';

export default function ManagerPage() {

  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalItemsSold: 0
  });

  const[graphData, setGraphData] = React.useState([]);

  React.useEffect(() => {
    async function loadStats() {
      const res = await fetch("/api/manager?action=stats");
      const data = await res.json();
      setStats(data);
    }

    async function loadGraph(){
      const res = await fetch("/api/manager?action=salesGraph");
      const data = await res.json();
      setGraphData(data);
      console.log("GRAPH DATA:", data);

    }
    loadStats();
    loadGraph();
  }, []);

  return (
    <Box sx={{ height: '100vh' }}>

      <AppBar position="static">
        <Toolbar>

          <Link href="/dashboard" style={{color: "white", textDecoration: "none"}}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" size="small">Menu</Button>
            </Box>
          </Link>

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
      {/*Graph */}
      <Box sx={{
        m: 3,
        p: 3,
        border: '2px solid black',
        borderRadius: 3
      }}>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Total Sales Count
        </Typography>

        <BarChart
          xAxis={[
            {
              data: Array.isArray(graphData) ? graphData.map(item => item.label) : [],
              scaleType: 'band',
            },
          ]}
          series={[
            {
              data: Array.isArray(graphData) ? graphData.map(item => item.totalOrders) : [],
              label: 'Total Orders',
            },
          ]}
          height={300}
        />

      </Box>
    </Box>
  );
}
