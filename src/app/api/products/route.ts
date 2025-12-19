import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { handler } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(handler);

    if (!session || !session.user || (session.user as any).role === "buyer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, category, images, weight, stock } = body;

    if (!title || !description || !price || !category || !images ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      title,
      description,
      price,
      category,
      images,
      weight,
      stock,
      sellerId: (session.user as any).id,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const sellerId = searchParams.get("sellerId");

    const query: any = {};
    if (category) query.category = category;
    if (sellerId) query.sellerId = sellerId;
    
    // Default filter active products
    query.active = true;

    await connectDB();
    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
