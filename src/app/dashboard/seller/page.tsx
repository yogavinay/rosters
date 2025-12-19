"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Upload } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Rooster",
    weight: "",
    stock: "1",
    imageFiles: null as FileList | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  if (status === "loading") return <div className="p-8">Loading...</div>;
  
  if (!session || (session.user as any).role !== "seller") {
    // Ideally redirect, but for now show message
    return <div className="p-8">Access Denied. Seller account required.</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, imageFiles: e.target.files });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload images to Firebase Storage
      const imageUrls: string[] = [];
      if (formData.imageFiles) {
        for (let i = 0; i < formData.imageFiles.length; i++) {
          const file = formData.imageFiles[i];
          const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          imageUrls.push(downloadURL);
        }
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          weight: formData.weight,
          stock: Number(formData.stock),
          images: imageUrls,
        }),
      });

      if (!res.ok) throw new Error("Failed to create product");

      setIsAddingProduct(false);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "Rooster",
        weight: "",
        stock: "1",
        imageFiles: null,
      });
      // In a real app we'd refresh the product list here
      alert("Product added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error adding product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
        <button
          onClick={() => setIsAddingProduct(!isAddingProduct)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          {isAddingProduct ? "Cancel" : <><Plus className="h-4 w-4" /> Add Product</>}
        </button>
      </div>

      {isAddingProduct && (
        <div className="bg-card p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Rooster">Rooster</option>
                  <option value="Hen">Hen</option>
                  <option value="Egg">Egg</option>
                  <option value="Chick">Chick</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1">Stock</label>
                 <input
                  type="number"
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1">Weight</label>
                 <input
                  type="text"
                  className="w-full rounded-md border bg-background px-3 py-2"
                  placeholder="e.g. 1.5kg"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1">Images</label>
                 <input
                  type="file"
                  accept="image/*"
                  multiple
                  required
                  className="w-full rounded-md border bg-background px-3 py-2"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                required
                className="w-full rounded-md border bg-background px-3 py-2 h-24"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      )}

      {/* Orders List */}
      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        {/* We need to fetch orders here too, let's reuse the fetch logic */}
        <SellerOrdersList />
      </div>
    </div>
  );
}

function SellerOrdersList() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    
    useEffect(() => {
        if (session) {
            fetch("/api/orders/list")
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err));
        }
    }, [session]);

    if (!orders.length) {
        return <div className="text-muted-foreground">No orders received yet.</div>;
    }

    // Calculate total earnings for this seller
    const myId = (session?.user as any).id;
    const myEarnings = orders.reduce((total, order) => {
        const myItems = order.items.filter((item: any) => item.sellerId === myId);
        const orderVal = myItems.reduce((sum: number, item: any) => sum + (item.priceAtPurchase * item.quantity), 0);
        return total + (orderVal * 0.95); // 95% earnings
    }, 0);

    return (
        <div className="space-y-6">
             <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <p className="text-sm font-medium text-green-800">Total Earnings (95%)</p>
                <p className="text-2xl font-bold text-green-900">₹{Math.round(myEarnings)}</p>
             </div>

             {orders.map(order => {
                 // Filter items for this seller
                 const myItems = order.items.filter((item: any) => item.sellerId === myId);
                 if (myItems.length === 0) return null;

                 return (
                    <div key={order._id} className="bg-card border rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between mb-4 border-b pb-2">
                            <div>
                                <p className="text-sm font-medium">Order #{order.orderId.slice(-6)}</p>
                                <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {myItems.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span>{item.productId?.title} (x{item.quantity})</span>
                                    <span>₹{item.priceAtPurchase * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                 );
             })}
        </div>
    );
}
