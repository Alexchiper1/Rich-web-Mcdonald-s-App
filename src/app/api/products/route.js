import { MongoClient } from "mongodb";

export async function GET() {
  try {
    console.log("Products API called");

    const uri = "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(uri);

    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("app");
    const products = await db.collection("products").find({}).toArray();

    console.log("Sending products:", products.length);

    return Response.json(products);

  } catch (err) {
    console.log("PRODUCTS API ERROR:", err);
    return Response.json([]);
  }
}
