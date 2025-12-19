"use client";

import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
        if (document.body.contains(script)) {
            document.body.removeChild(script);
        }
    };
  }, []);

  if (cart.length === 0) {
      return <div className="p-8">Your cart is empty</div>;
  }

  if (!session) {
      return <div className="p-8">Please login to checkout</div>;
  }

  const handlePayment = async () => {
    if (!shippingAddress) {
        alert("Please enter a shipping address");
        return;
    }
    setIsLoading(true);

    try {
      // 1. Create Order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cart,
          shippingAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order creation failed");
      }

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Andhra Rosters",
        description: "Purchase Order",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: data.dbOrderId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            clearCart();
            router.push(`/dashboard/buyer?success=true`);
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: session.user?.name,
          email: session.user?.email,
        },
        theme: {
          color: "#eab308",
        },
      };

      if ((window as any).Razorpay) {
         const rzp1 = new (window as any).Razorpay(options);
         rzp1.open();
      } else {
         alert("Razorpay SDK not loaded. Please refresh.");
      }
      
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <textarea
            required
            placeholder="Enter your full shipping address..."
            className="w-full rounded-md border bg-background px-3 py-2 h-32"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        </div>

        <div className="border-t pt-4">
           <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
           <div className="space-y-2 mb-4">
             {cart.map(item => (
                 <div key={item.productId} className="flex justify-between text-sm">
                     <span>{item.title} x {item.quantity}</span>
                     <span>₹{item.price * item.quantity}</span>
                 </div>
             ))}
           </div>
           
           <div className="flex justify-between font-bold text-lg border-t pt-4">
               <span>Total to Pay</span>
               <span>₹{cartTotal}</span>
           </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-md font-bold text-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : "Pay Now with Razorpay"}
        </button>
      </div>
    </div>
  );
}
