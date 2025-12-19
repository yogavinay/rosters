"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some quality poultry to your cart!</p>
        <Link href="/products" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
        <section className="lg:col-span-7">
          <ul className="border-t border-b divide-y">
            {cart.map((item) => (
              <li key={item.productId} className="flex py-6 sm:py-10">
                <div className="flex-shrink-0">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <Link href={`/products/${item.productId}`} className="font-medium text-foreground">
                            {item.title}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm font-medium text-foreground">₹{item.price}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <label className="sr-only">Quantity, {item.title}</label>
                      <span className="text-sm text-muted-foreground">Qty {item.quantity}</span>
                      
                      <div className="absolute right-0 top-0">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Remove</span>
                          <Trash2 className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
             <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
          </div>
        </section>

        {/* Order Summary */}
        <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 dark:bg-card border">
          <h2 className="text-lg font-medium text-foreground">Order summary</h2>
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Subtotal</dt>
              <dd className="text-sm font-medium text-foreground">₹{cartTotal}</dd>
            </div>
            
            <div className="flex items-center justify-between border-t pt-4">
              <dt className="text-base font-medium text-foreground">Order total</dt>
              <dd className="text-base font-medium text-foreground">₹{cartTotal}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <Link
              href="/checkout"
              className="w-full flex justify-center items-center rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Checkout
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
