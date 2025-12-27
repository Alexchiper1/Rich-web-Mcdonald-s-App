import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  let client;

  try {
    const uri =
      process.env.MONGODB_URI ||
      "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/?appName=Cluster0";

    client = new MongoClient(uri);
    await client.connect();

    const db = client.db("app");

    // try common collection names
    const colNames = ["products", "Products", "product", "Product"];
    let products = [];

    for (const name of colNames) {
      const data = await db.collection(name).find({}).toArray();
      if (data.length > 0) {
        products = data;
        console.log("Using collection:", name, "count:", data.length);
        break;
      }
    }

    return NextResponse.json(products);
  } catch (err) {
    console.log("PRODUCTS API ERROR:", err);
    return NextResponse.json([], { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
