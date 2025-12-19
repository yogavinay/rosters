import Link from "next/link";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { notFound } from "next/navigation";
import { ShoppingCart } from "lucide-react";
// We will create this client component next for interactivity
import AddToCartButton from "@/components/AddToCartButton"; 

async function getProduct(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id).populate("sellerId", "name").lean();
    if (!product) return null;
    return {
        ...product,
        _id: product._id.toString(),
        sellerId: {
            _id: product.sellerId._id.toString(),
            name: product.sellerId.name,
        },
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };
  } catch (e) {
    return null;
  }
}

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Image Gallery */}
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
           <img
            src={product.images[0] || "/placeholder.png"}
            alt={product.title}
            className="h-full w-full object-cover object-center"
           />
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{product.title}</h1>
          
          <div className="mt-3">
             <h2 className="sr-only">Product information</h2>
             <p className="text-3xl tracking-tight text-foreground">₹{product.price}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
             <div className="space-y-6 text-base text-muted-foreground">
                <p>{product.description}</p>
             </div>
          </div>
          
          <div className="mt-8 border-t pt-8">
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                   <span className="font-medium text-foreground">Category:</span> {product.category}
                </div>
                <div>
                   <span className="font-medium text-foreground">Weight:</span> {product.weight || "N/A"}
                </div>
                <div>
                   <span className="font-medium text-foreground">Seller:</span> {product.sellerId.name}
                </div>
                <div>
                   <span className="font-medium text-foreground">Stock:</span> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </div>
             </div>
          </div>

          <div className="mt-8">
             <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
