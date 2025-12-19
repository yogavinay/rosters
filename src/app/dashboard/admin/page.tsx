"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
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

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  const totalCommission = orders.reduce((acc, order) => acc + (order.commissionAmount || 0), 0);
  const totalSales = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Sales</h3>
            <p className="text-2xl font-bold">₹{totalSales}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Commission (5%)</h3>
            <p className="text-2xl font-bold text-green-600">₹{totalCommission}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
            <p className="text-2xl font-bold">{orders.length}</p>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
      <div className="overflow-x-auto bg-card rounded-lg border">
         <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                    <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.buyerId?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {order.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.totalAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">₹{order.commissionAmount}</td>
                    </tr>
                ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
