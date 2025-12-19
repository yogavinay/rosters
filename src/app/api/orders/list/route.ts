import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { handler } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(handler);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = (session.user as any).role;
    
    await connectDB();
    
    let query = {};
    
    if (role === "buyer") {
        query = { buyerId: (session.user as any).id };
    } else if (role === "seller") {
        query = { "items.sellerId": (session.user as any).id };
    } else if (role === "admin") {
        query = {}; // Admin sees all
    }

    const orders = await Order.find(query)
        .populate("items.productId", "title images")
        .populate("buyerId", "name email")
        .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
