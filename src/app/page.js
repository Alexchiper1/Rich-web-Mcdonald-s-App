'use client';

import * as React from 'react';

import Avatar from '@mui/material/Avatar';

import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';


import TextField from '@mui/material/TextField';

import FormControlLabel from '@mui/material/FormControlLabel';

import Checkbox from '@mui/material/Checkbox';

import Link from '@mui/material/Link';

import Container from '@mui/material/Container';

import Box from '@mui/material/Box';



export default function Home() {

  const router = useRouter();


  const handleSubmit = (event) => {
    event.preventDefault();
                

  console.log("handling submit");

  event.preventDefault();

  const data = new FormData(event.currentTarget);



   const email = data.get('email')

   const pass = data.get('pass')


   console.log("Sent email:" + email)

   console.log("Sent pass:" + pass)



 
   runDBCallAsync(email, pass);




 }; // end handle submit
 async function runDBCallAsync(email, pass) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pass }) 
  });

  const data = await res.json();

  if (data.valid === true) {
    if (data.role === "customer") {
       router.push('/dashboard');
    }
    if (data.role === "manager") {
      router.push('/manager');
    }
  } else {
    alert("Invalid login details");
  }
}



  return (

    <Container maxWidth="sm">

    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center'}} >


    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1}}>

    <TextField

      margin="normal"

      required

      fullWidth

      id="email"

      label="Email Address"

      name="email"

      autoComplete="email"

      autoFocus

    />

    <TextField

      margin="normal"

      required

      fullWidth

      name="pass"

      label="Password"

      type="password"

      id="pass"

      autoComplete="current-password"

    />

    <FormControlLabel

      control={<Checkbox value="remember" color="primary" />}

      label="Remember me"

    />

    <Button

      type="submit"

      fullWidth

      variant="contained"

      sx={{ mt: 3, mb: 2 }}

    >

      Sign In

    </Button>

    <Box sx={{ textAlign: 'center' }}>
      <Link href="/newregister" variant="body2">
        {"Don't have an account? Sign up"}
      </Link>
    </Box>

</Box>

</Box>

       </Container>

  ); // end return

}

