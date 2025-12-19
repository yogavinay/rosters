import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Razorpay from "razorpay";
import { handler } from "@/app/api/auth/[...nextauth]/route";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(handler);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { cartItems, shippingAddress } = await req.json();

    if (!cartItems || cartItems.length === 0 || !shippingAddress) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify Stock and Calculate Total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Stock unavailable for ${item.title}` },
          { status: 400 }
        );
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    // Commission Logic: 5%
    const commissionAmount = Math.round(totalAmount * 0.05);
    const sellerEarnings = totalAmount - commissionAmount;

    // Create Razorpay Order
    const options = {
      amount: totalAmount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save Order to DB
    const order = await Order.create({
      buyerId: (session.user as any).id,
      items: orderItems,
      totalAmount,
      commissionAmount,
      sellerEarnings,
      status: "pending",
      orderId: razorpayOrder.id,
      shippingAddress,
    });

    return NextResponse.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        dbOrderId: order._id
    });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
