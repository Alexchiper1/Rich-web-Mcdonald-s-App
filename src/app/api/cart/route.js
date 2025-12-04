let cart = [];

export async function GET(req) {

  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name");
  const removeIndex = searchParams.get("remove");
  const clear = searchParams.get("clear");

  // Add item
  if (name) {
    cart.push(name);
    return Response.json({ success: true, cart });
  }

  // Remove item by index
  if (removeIndex !== null) {
    cart.splice(parseInt(removeIndex), 1);
    return Response.json({ success: true, cart });
  }

  // Clear entire cart
  if (clear === "true") {
    cart = [];
    return Response.json({ success: true, cart });
  }

  return Response.json({ success: true, cart });
}

export { cart };
