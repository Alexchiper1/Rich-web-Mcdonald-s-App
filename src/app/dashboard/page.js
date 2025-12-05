'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';

export default function DashboardPage() {

  // STATE FOR REAL PRODUCTS
  const [products, setProducts] = React.useState([]);

  // LOAD PRODUCTS FROM API
  React.useEffect(() => {
    async function loadProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }
    loadProducts();
  }, []);

  function putInCart(pname) {
    console.log("putting in cart:", pname);
    fetch("/api/cart?name=" + pname);
  }


  return (
    <Box sx={{ flexGrow: 1 }}>

      {/* Top App Bar */}
      <AppBar position="static">
        <Toolbar>

          <Link href="/manager" style={{color: "white", textDecoration: "none"}}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" size="small">Manager Dashboard</Button>
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div">McDonald's</Typography>
          </Box>

          <Link href="/checkout" style={{color: "white", textDecoration: "none"}}>
            <Box>
              <IconButton color="inherit" aria-label="cart">
                <ShoppingCartIcon />
              </IconButton>
            </Box>
          </Link>

        </Toolbar>
      </AppBar>

      {/* Product Grid */}
      <Box
        sx={{
          p: 2,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        {products.map((product, index) => (
          <Card
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              sx={{
                height: 160,
                width: '100%',
                objectFit: 'cover',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                €{product.price.toFixed(2)}
              </Typography>
            </CardContent>

            <CardActions sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => putInCart(product.name)}
              >
                ADD TO CART
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
