import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } =
      await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await connectDB();
      const order = await Order.findById(dbOrderId);
      
      if (!order) {
           return NextResponse.json({ message: "Order not found" }, { status: 404 });
      }

      order.status = "paid";
      order.paymentId = razorpay_payment_id;
      await order.save();

      // Reduce Stock
      for (const item of order.items) {
          await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
      }

      return NextResponse.json({ message: "Payment verified", success: true });
    } else {
      return NextResponse.json(
        { message: "Invalid signature", success: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
