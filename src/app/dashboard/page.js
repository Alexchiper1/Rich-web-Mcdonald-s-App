"use client";

import * as React from "react";
import Link from "next/link";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Skeleton,
  Tooltip,
  Badge,
  Snackbar,
  Alert
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

import { logout } from "../utils/logout";

export default function DashboardPage() {
  const [products, setProducts] = React.useState([]);
  const [weather, setWeather] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // cart badge + toast
  const [cartCount, setCartCount] = React.useState(0);
  const [toastOpen, setToastOpen] = React.useState(false);

  const safeImage = (src) => {
    const s = String(src || "").replaceAll("\\", "/").trim();
    if (!s) return "/images/bigmac.jpg";
    if (s.startsWith("http")) return s;
    if (s.startsWith("/")) return s;
    return "/" + s;
  };

  // load products
  React.useEffect(() => {
    async function loadProducts() {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    loadProducts();
  }, []);

  // load weather
  React.useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch(
          "https://api.weatherapi.com/v1/current.json?key=e98894c8719d4c79bbd133512250712&q=Dublin&aqi=no"
        );
        const data = await res.json();
        setWeather(data);
      } catch (e) {}
    }
    loadWeather();
  }, []);

  // load cart count
  React.useEffect(() => {
    async function loadCart() {
      const res = await fetch("/api/getCart", { cache: "no-store" });
      const data = await res.json();
      setCartCount((data.cart || []).length);
    }
    loadCart();
  }, []);

  // add to cart
  async function putInCart(pname) {
    const res = await fetch("/api/cart?name=" + encodeURIComponent(pname));
    const data = await res.json();

    setCartCount((data.cart || []).length);

    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 1200);
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={6}
        sx={{ background: "linear-gradient(90deg, #DA291C, #b21c13)" }}
      >
        <Toolbar>
          {/* Logout (LEFT) */}
          <Button
            color="inherit"
            startIcon={<ExitToAppRoundedIcon />}
            onClick={logout}
            sx={{ fontWeight: 900 }}
          >
            Logout
          </Button>

          {/* Title */}
          <Box
            sx={{
              flexGrow: 1,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <LocalFireDepartmentRoundedIcon />
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.6 }}>
              McDonald&apos;s Menu
            </Typography>
          </Box>

          {/* Weather */}
          {weather?.current && (
            <Chip
              label={`${weather.location.name} · ${Math.round(weather.current.temp_c)}°C`}
              color="secondary"
              sx={{ mr: 1.5, fontWeight: 900 }}
            />
          )}

          {/* Cart */}
          <Link href="/checkout" style={{ color: "white", textDecoration: "none" }}>
            <Tooltip title="Cart">
              <IconButton color="inherit">
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Products */}
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          display: "grid",
          gap: 2.2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        }}
      >
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Box key={i}>
              <Skeleton variant="rounded" height={320} />
            </Box>
          ))}

        {!loading &&
          products.map((product, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.08)",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
                },
              }}
            >
              <CardMedia
                component="img"
                src={safeImage(product.image)}
                alt={product.name}
                onError={(e) => (e.currentTarget.src = "/images/bigmac.jpg")}
                sx={{ height: 170, objectFit: "cover" }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  €{Number(product.price).toFixed(2)}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => putInCart(product.name)}
                  sx={{ fontWeight: 900 }}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          ))}
      </Box>

      <Snackbar open={toastOpen} autoHideDuration={1200} onClose={() => setToastOpen(false)}>
        <Alert severity="success" variant="filled">
          Added to cart ✅
        </Alert>
      </Snackbar>
    </Box>
  );
}
