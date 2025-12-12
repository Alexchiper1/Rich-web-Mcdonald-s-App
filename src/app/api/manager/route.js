import { MongoClient } from "mongodb";

export async function GET(req) {
  console.log("Manager API called");

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  const uri = "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/?appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("app");

    if (action === "stats") {
      const orders = await db.collection("Orders").find({}).toArray();

      let totalOrders = orders.length;
      let totalRevenue = 0;
      let totalItemsSold = 0;

      for (let order of orders) {
        totalRevenue += order.total;
        totalItemsSold += order.items.length; 
      }

      return Response.json({
        totalOrders,
        totalRevenue,
        totalItemsSold
      });
    }

    if (action === "all") {
      const orders = await db.collection("Orders").find({}).toArray();
      return Response.json({ data: orders });
    }

    //Graph code
      if (action === "salesGraph") {

      const orders = await db.collection("Orders").find({}).toArray();
      const counts = {};

      for (let order of orders) {
        const date = new Date(order.date || order.createdAt || Date.now());
        const label = date.toLocaleDateString("en-IE", { weekday: "short" });

        if (!counts[label]) {
          counts[label] = 0;
        }
        counts[label]++;
      }

      const graphData = Object.keys(counts).map(day => ({
        label: day,
        totalOrders: counts[day]
      }));

      return Response.json(graphData);
    }

    return Response.json({ error: "Invalid action" });

  } catch (err) {
    console.log("MANAGER API ERROR:", err);
    return Response.json({ error: "failed" });

  } finally {
    await client.close();
  }
}
