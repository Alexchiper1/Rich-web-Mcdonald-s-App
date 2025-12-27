import { MongoClient } from "mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  // block non-managers
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "manager") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  const uri = process.env.MONGODB_URI || "mongodb+srv://b00161706:pass@cluster0.p7d3dvm.mongodb.net/?appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("app");
    const ordersCol = db.collection("Orders");

    if (action === "stats") {
      const orders = await ordersCol.find({}).toArray();

      const totalOrders = orders.length;
      let totalRevenue = 0;
      let totalItemsSold = 0;

      for (let order of orders) {
        totalRevenue += Number(order.total || 0);
        totalItemsSold += Array.isArray(order.items) ? order.items.length : 0;
      }

      const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

      return NextResponse.json({
        totalOrders,
        totalRevenue,
        totalItemsSold,
        avgOrderValue,
      });
    }

    if (action === "salesGraph") {
      const orders = await ordersCol.find({}).toArray();
      const counts = {};
      const revenue = {};

      for (let order of orders) {
        const date = new Date(order.date || order.createdAt || Date.now());
        const label = date.toLocaleDateString("en-IE", { weekday: "short" });

        counts[label] = (counts[label] || 0) + 1;
        revenue[label] = (revenue[label] || 0) + Number(order.total || 0);
      }

      const graphData = Object.keys(counts).map((day) => ({
        label: day,
        totalOrders: counts[day],
        totalRevenue: Number(revenue[day] || 0),
      }));

      return NextResponse.json(graphData);
    }

    // top selling items (counts by item name)
    if (action === "topItems") {
      const orders = await ordersCol.find({}).toArray();
      const itemCounts = {};

      for (let order of orders) {
        const items = Array.isArray(order.items) ? order.items : [];
        for (let name of items) {
          itemCounts[name] = (itemCounts[name] || 0) + 1;
        }
      }

      const top = Object.entries(itemCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      return NextResponse.json(top);
    }

    // recent orders
    if (action === "recent") {
      const recent = await ordersCol.find({}).sort({ date: -1 }).limit(10).toArray();
      return NextResponse.json(recent);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.log("MANAGER API ERROR:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  } finally {
    await client.close();
  }
}
