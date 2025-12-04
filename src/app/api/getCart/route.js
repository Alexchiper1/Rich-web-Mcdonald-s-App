import { cart } from "../cart/route";

export async function GET() {
  console.log("Sending cart:", cart);
  return Response.json({ cart });
}
