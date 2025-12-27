import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, pass } = await req.json();

    const uri = process.env.MONGODB_URI || "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(uri);

    await client.connect();
    const db = client.db("app");
    const users = db.collection("Users");

    const user = await users.findOne({ username: email });

    // validate
    if (!user || user.pass !== pass) {
      const res = NextResponse.json({ valid: false });
      res.cookies.set("role", "", { path: "/", maxAge: 0 });
      res.cookies.set("email", "", { path: "/", maxAge: 0 });
      return res;
    }

    // response + cookie
    const res = NextResponse.json({
      valid: true,
      role: user.acctype,
    });

    // httpOnly cookies (can't be read by JS)
    res.cookies.set("role", user.acctype, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 6, // 6 hours
    });

    res.cookies.set("email", email, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 6,
    });

    return res;
  } catch (err) {
    console.error("LOGIN API ERROR:", err);
    return NextResponse.json({ valid: false, error: "db_error" }, { status: 500 });
  }
}
