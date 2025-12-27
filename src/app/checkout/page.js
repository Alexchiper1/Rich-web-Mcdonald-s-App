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
  Chip
} from "@mui/material";

export default function CartPage() {
  const [cartItems, setCartItems] = React.useState([]);
  const [productData, setProductData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // load cart + products
  React.useEffect(() => {
    async function load() {
      setLoading(true);

      const cartRes = await fetch("/api/getCart", { cache: "no-store" });
      const cartJson = await cartRes.json();
      setCartItems(cartJson.cart || []);

      const prodRes = await fetch("/api/products", { cache: "no-store" });
      const prodJson = await prodRes.json();
      setProductData(prodJson || []);

      setLoading(false);
    }
    load();
  }, []);

  // build detailed cart
  const detailedCart = cartItems
    .map((name) => productData.find((p) => p.name === name))
    .filter(Boolean);

  // remove item
  async function removeItem(index) {
    await fetch(`/api/cart?remove=${index}`);
    const res = await fetch("/api/getCart", { cache: "no-store" });
    const data = await res.json();
    setCartItems(data.cart || []);
  }

  // total
  const total = detailedCart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  // place order (demo)
  async function placeOrder() {
    const email = "customer@test.com";

    await fetch(
      `/api/checkout?action=place&email=${encodeURIComponent(email)}&items=${encodeURIComponent(
        JSON.stringify(cartItems)
      )}&total=${total}`
    );

    // clear cart after purchase
    await fetch("/api/cart?clear=true");

    alert("Order placed!");
    window.location.href = "/dashboard";
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="sticky" sx={{ background: "linear-gradient(90deg, #DA291C, #b21c13)" }}>
        <Toolbar>
          <Link href="/dashboard" style={{ color: "white", textDecoration: "none" }}>
            <Button color="inherit" size="small" sx={{ fontWeight: 900 }}>
              Menu
            </Button>
          </Link>

          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Checkout
            </Typography>
          </Box>

          <Chip label={`${detailedCart.length} items`} color="secondary" sx={{ fontWeight: 900 }} />
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, display: "grid", placeItems: "center" }}>
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 520,
            p: { xs: 2, sm: 3 },
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
            Your Cart
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {loading && <Typography>Loading...</Typography>}

          {!loading && detailedCart.length === 0 && (
            <Typography sx={{ opacity: 0.8 }}>Cart is empty.</Typography>
          )}

          {!loading &&
            detailedCart.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 1.2,
                  mb: 1.2,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.12)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 900 }}>{item.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.75 }}>
                    €{Number(item.price).toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => removeItem(index)}
                  sx={{ fontWeight: 900 }}
                >
                  Remove
                </Button>
              </Box>
            ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontWeight: 900, fontSize: 18 }}>Total</Typography>
            <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
              €{total.toFixed(2)}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 2, py: 1.2, fontWeight: 900 }}
            disabled={detailedCart.length === 0}
            onClick={placeOrder}
          >
            Place Order
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
