import Link from "next/link";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { Filter } from "lucide-react";

async function getProducts(category: string | undefined) {
  await connectDB();
  const query: any = { active: true };
  if (category) {
    query.category = category;
  }
  
  // Lean query for performance
  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  // Convert _id and dates to string to avoid serialization issues
  return products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    sellerId: p.sellerId.toString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const products = await getProducts(searchParams.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-baseline mb-8">
        <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
        <div className="flex items-center gap-4">
            {/* Simple Category Filter Links */}
            <Link href="/products" className={`text-sm ${!searchParams.category ? 'font-bold text-primary' : 'text-muted-foreground'}`}>All</Link>
            <Link href="/products?category=Rooster" className={`text-sm ${searchParams.category === 'Rooster' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>Roosters</Link>
            <Link href="/products?category=Hen" className={`text-sm ${searchParams.category === 'Hen' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>Hens</Link>
            <Link href="/products?category=Egg" className={`text-sm ${searchParams.category === 'Egg' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>Eggs</Link>
            <Link href="/products?category=Chick" className={`text-sm ${searchParams.category === 'Chick' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>Chicks</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product._id} className="group relative bg-card rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square w-full overflow-hidden bg-gray-200">
              {/* Using img tag for simplicity, ideally next/image */}
              <img
                src={product.images[0] || "/placeholder.png"}
                alt={product.title}
                className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    <Link href={`/products/${product._id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
                </div>
                <p className="text-sm font-medium text-foreground">₹{product.price}</p>
              </div>
               {product.weight && <p className="text-xs text-muted-foreground">Weight: {product.weight}</p>}
               {product.stock <= 0 && <p className="text-xs text-red-500 font-medium">Out of Stock</p>}
            </div>
          </div>
        ))}
        {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
                No products found in this category.
            </div>
        )}
      </div>
    </div>
  );
}
