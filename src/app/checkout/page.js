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
      // get the cart items
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

  // Remove item from the list
  async function removeItem(index) {
    await fetch(`/api/cart?remove=${index}`);
    const res = await fetch("/api/getCart");
    const data = await res.json();
    setCartItems(data.cart);
  }

  // calculates the total
  const total = detailedCart.reduce((sum, item) => {
    return sum + (item.price || 0);
  }, 0);

  // places order
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

          <Link href="/dashboard" style={{color: "white", textDecoration: "none"}}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" size="small">MENU</Button>
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div">McDonald's</Typography>
          </Box>

        </Toolbar>
      </AppBar>

        <Box sx={{ mt: 1,mx: "auto", maxWidth: 420, p: 1.5 }}>

          {detailedCart.map((item, index) => (
            <Box
              key={index}
              sx={{
                border: '1.5px solid #000',
                borderRadius: 1.5,
                p: 0.4,
                mt: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: "center"
              }}
            >
              <span>{item.name} — €{item.price}</span>
              <Button 
                variant="outlined" 
                color="error"
                size='small'
                onClick={() => removeItem(index)}
              >
                Remove
              </Button>
            </Box>
          ))}

          <Box sx={{ mt: 2, fontSize: 19, fontWeight: "bold", textAlign: "right"}}>
            Total: €{total.toFixed(2)}
          </Box>

          <Button
            variant="contained"
            sx={{mt: 1.5}}
            onClick={placeOrder}
          >
            Checkout
          </Button>

        </Box>

    </Box>
  );
}
