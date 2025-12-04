import { MongoClient } from "mongodb";

export async function GET(req) {
  console.log("in the api page");

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const pass = searchParams.get("pass");

    console.log("Email:", email);
    console.log("Pass:", pass);

    const uri =
      "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/app?retryWrites=true&w=majority&appName=Cluster0";

    const client = new MongoClient(uri);

    await client.connect();
    console.log("Connected to db");

    const db = client.db("app");
    const loginCollection = db.collection("Users");

    const user = await loginCollection.findOne({ username: email });

    console.log("User found:", user);

    let valid = false;
    let role = "";

    if (user && user.pass === pass) {
      valid = true;
      role = user.acctype;
    }

    return Response.json({
      valid: valid,
      role: role
    });

  } catch (err) {
    console.log("LOGIN API ERROR:", err);

    return Response.json({
      valid: false,
      role: "",
      error: "login_failed"
    });
  }
}
