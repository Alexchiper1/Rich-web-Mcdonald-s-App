import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  let client;

  try {
    // read json from frontend
    const body = await req.json();
    const email = body.email;
    const pass = body.pass;
    const address = body.address;
    const telephone = body.telephone;

    // validate fields
    if (!email || !pass || !address || !telephone) {
      return NextResponse.json({ data: "missing_fields" }, { status: 400 });
    }

    // connect mongo
    const uri =
      process.env.MONGODB_URI ||
      "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/?appName=Cluster0";

    client = new MongoClient(uri);
    await client.connect();

    // db + collection
    const db = client.db("app");
    const users = db.collection("Users");

    // stop duplicate
    const existing = await users.findOne({ username: email });

    if (existing) {
      return NextResponse.json({ data: "email_exists" });
    }

    // insert
    await users.insertOne({
      username: email,
      pass: pass,
      address: address,
      telephone: telephone,
      acctype: "customer"
    });

    return NextResponse.json({ data: "inserted" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ data: "error" }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
