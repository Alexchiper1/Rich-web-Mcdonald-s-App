'use client';

import * as React from 'react';

import Avatar from '@mui/material/Avatar';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import FormControlLabel from '@mui/material/FormControlLabel';

import Checkbox from '@mui/material/Checkbox';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from 'next/link';



export default function RegisterPage() {


  const handleSubmit = (event) => {

                

  console.log("handling submit");

  event.preventDefault();

  const data = new FormData(event.currentTarget);



    let email = data.get('email')

   let pass = data.get('pass')

   let address = data.get('address')

   let telephone = data.get('telephone')

   let secondEmail = data.get('secondEmail')

   let secondPass = data.get('secondPass')

   console.log("Sent email:" + email)

   console.log("Sent pass:" + pass)

   console.log("Sent pass:" + address)

   console.log("Sent pass:" + telephone)

   console.log("Sent pass:" + secondEmail)

   console.log("Sent pass:" + secondPass)



    runDBCallAsync(
      `http://localhost:3000/api/newregister?email=${email}&pass=${pass}&address=${address}&telephone=${telephone}&secondEmail=${secondEmail}&secondPass=${secondPass}`
    );

  }; // end handle submit


async function runDBCallAsync(url) {

    console.log("CALLING DB: " + url);

    const res = await fetch(url);

    const data = await res.json();

    console.log("DB returned: ", data); 

    if (data.data === "inserted") {

      console.log("REGISTER SUCCESS!");

      // redirect to login after successful register
      window.location.href = "/login";

    } else if (data.data === "email_exists") {

      alert("Email already used");

    } else {

      console.log("REGISTER FAILED");
    }


  }




  return (

    <Container maxWidth="sm">

    <Box sx={{ height: '100vh' }} >

    <h1 style={{ textAlign: "center" }}>Create Account</h1>

    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

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

      type="pass"

      id="password"

      autoComplete="current-password"

    />

    <TextField

      margin="normal"

      required

      fullWidth

      id="address"

      label="Home Address"

      name="address"

      autoComplete="address"

      autoFocus

    />

    <TextField

      margin="normal"

      required

      fullWidth

      id="telephone"

      label="Home telephone"

      name="telephone"

      autoComplete="telephone"

      autoFocus

    />
     <TextField

      margin="normal"

      required

      fullWidth

      id="secondEmail"

      label="Second Email"

      name="secondEmail"

      autoComplete="secondEmail"

      autoFocus

    />

     <TextField

      margin="normal"

      required

      fullWidth

      id="secondPass"

      label="Second Password"

      name="secondPass"

      autoComplete="secondPass"

      autoFocus

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
            Register
          </Button>

          <Link href="/login">Already have an account? Login</Link>
</Box>

</Box>

       </Container>

  ); // end return

}

