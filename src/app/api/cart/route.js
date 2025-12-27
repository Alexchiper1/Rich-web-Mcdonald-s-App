import { NextResponse } from "next/server";

let cart = [];

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name");
  const removeIndex = searchParams.get("remove");
  const clear = searchParams.get("clear");

  if (name) {
    cart.push(name);
    console.log("CART ADD:", name, cart);
    return NextResponse.json({ success: true, cart });
  }

  if (removeIndex !== null) {
    const idx = parseInt(removeIndex, 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < cart.length) {
      cart.splice(idx, 1);
    }
    console.log("CART REMOVE:", idx, cart);
    return NextResponse.json({ success: true, cart });
  }

  if (clear === "true") {
    cart = [];
    console.log("CART CLEAR");
    return NextResponse.json({ success: true, cart });
  }

  return NextResponse.json({ success: true, cart });
}
