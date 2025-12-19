"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function BuyerDashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/orders/list")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [session]);

  if (loading) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
            <p className="text-muted-foreground mb-4">You have no orders yet.</p>
            <Link href="/products" className="text-primary hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-card border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4 border-b pb-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Order ID: {order.orderId}</p>
                        <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        p className="text-lg font-bold">Total: ₹{order.totalAmount}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {order.status.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="space-y-4">
                    {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                            <img src={item.productId?.images[0] || "/placeholder.png"} className="h-16 w-16 object-cover rounded-md" alt="" />
                            <div>
                                <p className="font-medium">{item.productId?.title || "Product Info Unavailable"}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity} x ₹{item.priceAtPurchase}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
