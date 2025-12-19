"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || "",
      quantity: 1,
      sellerId: product.sellerId._id || product.sellerId, // Handle both populated/unpopulated
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isAdded || product.stock <= 0}
      className={`flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 rounded-md font-medium transition-colors ${
        isAdded
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isAdded ? (
        <>
          <Check className="h-5 w-5" /> Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" /> {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </>
      )}
    </button>
  );
}
