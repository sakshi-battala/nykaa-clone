import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Check, CreditCard, Truck, Smartphone, Banknote, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { cn } from "../lib/utils";

const steps = ["Shipping", "Delivery", "Payment", "Review"];

const COUPONS: Record<string, number> = {
  NYKAA10: 0.10,
  BEAUTY20: 0.20,
  WELCOME15: 0.15,
};

export default function Checkout() {
  const { cart, cartSubtotal, clearCart } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({ fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"card" | "upi" | "cod">("card");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; pct: number } | null>(null);

  const deliveryFee = delivery === "express" ? 10 : cartSubtotal > 50 ? 0 : 5;
  const discount = appliedCoupon ? cartSubtotal * appliedCoupon.pct : 0;
  const taxable = cartSubtotal - discount;
  const tax = +(taxable * 0.08).toFixed(2);
  const total = +(taxable + deliveryFee + tax).toFixed(2);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, pct: COUPONS[code] });
      toast.success(`Coupon ${code} applied`, { description: `You saved ${(COUPONS[code] * 100).toFixed(0)}%` });
    } else {
      toast.error("Invalid coupon code");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/products" className="inline-block mt-6 px-6 py-3 rounded-full bg-primary text-primary-foreground">Continue shopping</Link>
      </div>
    );
  }

  const placeOrder = () => {
    const orderId = "NYK" + Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
    localStorage.setItem("nykaa_last_order", JSON.stringify({ orderId, total, shipping, delivery, payment, items: cart, tax, discount, coupon: appliedCoupon?.code }));
    clearCart();
    navigate("/order-success");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="font-display text-4xl mb-8">Checkout</h1>

      <div className="flex items-center justify-between mb-10 max-w-2xl">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex items-center">
            <div className={cn("size-9 rounded-full grid place-items-center border-2 text-sm font-medium transition", i <= step ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground")}>
              {i < step ? <Check className="size-4" /> : i + 1}
            </div>
            <span className={cn("ml-2 text-sm hidden sm:inline", i <= step ? "" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <div className={cn("flex-1 h-px mx-3", i < step ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div>
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={shipping.fullName} onChange={(v) => setShipping({ ...shipping, fullName: v })} />
                <Input label="Email" type="email" value={shipping.email} onChange={(v) => setShipping({ ...shipping, email: v })} />
                <Input label="Phone" value={shipping.phone} onChange={(v) => setShipping({ ...shipping, phone: v })} />
                <Input label="Address" value={shipping.address} onChange={(v) => setShipping({ ...shipping, address: v })} className="sm:col-span-2" />
                <Input label="City" value={shipping.city} onChange={(v) => setShipping({ ...shipping, city: v })} />
                <Input label="State" value={shipping.state} onChange={(v) => setShipping({ ...shipping, state: v })} />
                <Input label="Pincode" value={shipping.pincode} onChange={(v) => setShipping({ ...shipping, pincode: v })} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Delivery Method</h2>
              <OptionCard active={delivery === "standard"} onClick={() => setDelivery("standard")} icon={<Truck className="size-5" />} title="Standard Delivery" desc="3-5 business days" price={cartSubtotal > 50 ? "Free" : "$5.00"} />
              <OptionCard active={delivery === "express"} onClick={() => setDelivery("express")} icon={<Truck className="size-5" />} title="Express Delivery" desc="1-2 business days" price="$10.00" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Payment Method</h2>
              <OptionCard active={payment === "card"} onClick={() => setPayment("card")} icon={<CreditCard className="size-5" />} title="Credit / Debit Card" desc="Visa, Mastercard, Amex" />
              <OptionCard active={payment === "upi"} onClick={() => setPayment("upi")} icon={<Smartphone className="size-5" />} title="UPI" desc="Google Pay, PhonePe, Paytm" />
              <OptionCard active={payment === "cod"} onClick={() => setPayment("cod")} icon={<Banknote className="size-5" />} title="Cash on Delivery" desc="Pay when your order arrives" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl">Order Review</h2>
              <Box title="Shipping">
                <p>{shipping.fullName}</p>
                <p>{shipping.address}, {shipping.city}, {shipping.state} {shipping.pincode}</p>
                <p>{shipping.email} · {shipping.phone}</p>
              </Box>
              <Box title="Delivery"><p className="capitalize">{delivery} delivery</p></Box>
              <Box title="Payment"><p className="uppercase">{payment === "cod" ? "Cash on Delivery" : payment}</p></Box>
              <Box title={`Items (${cart.length})`}>
                {cart.map((c) => (
                  <div key={c.product.id} className="flex justify-between text-sm py-1">
                    <span className="truncate pr-2">{c.product.name} × {c.quantity}</span>
                    <span>${(Number(c.product.price) * c.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </Box>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="px-6 py-3 rounded-full border border-border disabled:opacity-40">Back</button>
            {step < 3 ? (
              <button onClick={() => setStep((s) => s + 1)} className="px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-rose hover:text-white transition">Continue</button>
            ) : (
              <button onClick={placeOrder} className="px-8 py-3 rounded-full bg-rose text-white hover:opacity-90 transition">Place Order</button>
            )}
          </div>
        </div>

        <aside className="bg-muted/40 rounded-2xl p-6 h-fit space-y-4 lg:sticky lg:top-24">
          <h3 className="font-display text-xl">Order Summary</h3>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Tag className="size-3.5" /> Coupon code</label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-blush border border-rose/30">
                <span className="text-sm font-medium">{appliedCoupon.code} <span className="text-rose">−{(appliedCoupon.pct * 100).toFixed(0)}%</span></span>
                <button onClick={() => setAppliedCoupon(null)} className="text-muted-foreground hover:text-destructive"><X className="size-4" /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="NYKAA10" className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-rose" />
                <button onClick={applyCoupon} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-rose hover:text-white transition">Apply</button>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">Try: NYKAA10 · BEAUTY20 · WELCOME15</p>
          </div>

          <div className="space-y-1.5 text-sm pt-2 border-t border-border">
            <div className="flex justify-between"><span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-rose"><span>Discount</span><span>−${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", className = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg bg-card border border-border focus:outline-none focus:border-rose" />
    </label>
  );
}

function OptionCard({ active, onClick, icon, title, desc, price }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string; price?: string }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition", active ? "border-rose bg-blush/40" : "border-border hover:border-rose/40")}>
      <span className="size-10 rounded-full grid place-items-center bg-background">{icon}</span>
      <div className="flex-1"><p className="font-medium">{title}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      {price && <span className="font-semibold text-sm">{price}</span>}
      <span className={cn("size-5 rounded-full border-2 grid place-items-center", active ? "border-rose bg-rose" : "border-border")}>
        {active && <Check className="size-3 text-white" />}
      </span>
    </button>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{title}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}
