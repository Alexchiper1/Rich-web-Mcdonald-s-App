import { NextResponse } from "next/server";

export async function GET(req) {
  // always read cart from the cart endpoint
  const base = new URL(req.url).origin;

  const res = await fetch(`${base}/api/cart`, {
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json({ cart: data.cart || [] });
}
