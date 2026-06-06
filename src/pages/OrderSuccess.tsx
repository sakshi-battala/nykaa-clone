import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderSuccess() {
  const [order, setOrder] = useState<{ orderId: string; total: number } | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem("nykaa_last_order");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  const eta = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="size-24 mx-auto rounded-full bg-rose grid place-items-center animate-bounce">
        <Check className="size-12 text-white" />
      </div>
      <h1 className="font-display text-4xl mt-8">Thank you!</h1>
      <p className="text-muted-foreground mt-2">Your order has been placed successfully.</p>
      <div className="mt-8 p-6 rounded-2xl bg-muted/40 text-left space-y-2">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-semibold">{order?.orderId ?? "—"}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Paid</span><span className="font-semibold">${order?.total.toFixed(2) ?? "0.00"}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Estimated Delivery</span><span className="font-semibold">{eta}</span></div>
      </div>
      <Link to="/" className="inline-block mt-8 px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-rose transition">Continue Shopping</Link>
    </div>
  );
}
