import { MongoClient } from "mongodb";

export async function POST(req) {
  try {
    const { email, pass } = await req.json();

    const uri = "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(uri);

    await client.connect();
    console.log(" Connected to MongoDB");

    const db = client.db("app");
    const users = db.collection("Users");

    const user = await users.findOne({ username: email });

    if (!user || user.pass !== pass) {
      return Response.json({ valid: false });
    }

    return Response.json({
      valid: true,
      role: user.acctype
    });

  } catch (err) {
    console.error("LOGIN API ERROR:", err);
    return Response.json({ valid: false, error: "db_error" });
  }
}
