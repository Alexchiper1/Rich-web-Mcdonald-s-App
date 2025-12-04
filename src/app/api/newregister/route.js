import { MongoClient } from "mongodb";

export async function GET(req) {
  try {
    console.log("LOGIN API HIT");

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const pass = searchParams.get("pass");

    console.log("Email:", email);
    console.log("Pass:", pass);

    // CORRECT CONNECTION STRING
    const uri = "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/app?retryWrites=true&w=majority&appName=Cluster0";

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("app");
    const users = db.collection("Users");

    // LOOK FOR username (not email)
    const user = await users.findOne({ username: email });

    console.log("User found:", user);

    let valid = false;
    let role = "";

    if (user && user.pass === pass) {
      valid = true;
      role = user.acctype;
    }

    console.log("VALID:", valid);

    return Response.json({
      valid,
      role
    });

  } catch (err) {
    console.log("LOGIN API ERROR:", err);

    // PREVENT EMPTY JSON ERROR
    return Response.json({
      valid: false,
      role: "",
      error: "login_failed"
    });
  }
}
