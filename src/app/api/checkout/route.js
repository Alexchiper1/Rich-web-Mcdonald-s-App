import { MongoClient } from "mongodb";

export async function GET(req, res) {

  console.log("in the checkout api page");

  const { searchParams } = new URL(req.url);

  let action = searchParams.get("action");
  let email = searchParams.get("email");
  let items = searchParams.get("items");
  let total = searchParams.get("total");

  const uri = "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/?appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("app");

    // ---------- PLACE ORDER ----------
    //saves order to the db
    if (action === "place") {

      await db.collection("Orders").insertOne({
        email: email,               
        items: JSON.parse(items),    
        total: parseFloat(total),    
        date: new Date()
      });

      console.log("ORDER SAVED FOR:", email);

      return Response.json({ data: "order_added" });
    }

    return Response.json({ data: "no_action" });

  } catch (err) {

    console.log("CHECKOUT API ERROR:", err);
    return Response.json({ data: "failed" });

  } finally {
    await client.close();
  }
}
