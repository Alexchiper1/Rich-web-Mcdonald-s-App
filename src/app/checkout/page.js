'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function CartPage() {

  const [cartItems, setCartItems] = React.useState([]);
  const [productData, setProductData] = React.useState([]);

  React.useEffect(() => {
    async function load() {
      // Get cart items from server
      const cartRes = await fetch("/api/getCart");
      const cartJson = await cartRes.json();
      setCartItems(cartJson.cart);

      // Get products from DB
      const prodRes = await fetch("/api/products");
      const prodJson = await prodRes.json();
      setProductData(prodJson);
    }
    load();
  }, []);

  // Create full detailed items
  const detailedCart = cartItems.map((name, index) => {
    return { 
      id: index,
      ...productData.find(p => p.name === name)
    };
  });

  // Remove item
  async function removeItem(index) {
    await fetch(`/api/cart?remove=${index}`);
    const res = await fetch("/api/getCart");
    const data = await res.json();
    setCartItems(data.cart);
  }

  // Calculate total
  const total = detailedCart.reduce((sum, item) => {
    return sum + (item.price || 0);
  }, 0);

  // Place order
  async function placeOrder() {
    const email = "customer@test.com";

    await fetch(
      `/api/checkout?action=place&email=${email}&items=${JSON.stringify(cartItems)}&total=${total}`
    );

    // clear cart after purchase
    await fetch("/api/cart?clear=true");

    alert("Order placed!");
    window.location.href = "/dashboard";
  }

  return (
    <Box sx={{ flexGrow: 1 }}>

      <AppBar position="static">
        <Toolbar>

          <Link href="/dashboard">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" size="small">MENU</Button>
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div">McDonald's</Typography>
          </Box>

        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 4 }}>

        {detailedCart.map((item, index) => (
          <Box
            key={index}
            sx={{
              border: '2px solid #000',
              borderRadius: 2,
              p: 2,
              mt: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: "center"
            }}
          >
            <span>{item.name} — €{item.price}</span>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => removeItem(index)}
            >
              Remove
            </Button>
          </Box>
        ))}

        <Box sx={{ mt: 3, fontSize: 22, fontWeight: "bold" }}>
          Total: €{total.toFixed(2)}
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={placeOrder}
        >
          Checkout
        </Button>

      </Box>

    </Box>
  );
}
