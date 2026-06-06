import { Link } from "react-router-dom";
import { useState } from "react";
import { User, Package, Heart, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext";
import { cn } from "../lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

const mockOrders = [
  {
    id: "NYK248193",
    date: "May 28, 2026",
    status: "Delivered",
    total: 84.5,
    items: 3,
  },
  {
    id: "NYK248010",
    date: "May 12, 2026",
    status: "Delivered",
    total: 42.0,
    items: 2,
  },
  {
    id: "NYK247852",
    date: "Apr 22, 2026",
    status: "Delivered",
    total: 119.99,
    items: 5,
  },
];

const mockAddresses = [
  {
    name: "Home",
    line: "221B Baker Street",
    city: "London",
    pincode: "NW1 6XE",
  },
  {
    name: "Office",
    line: "5th Ave, Floor 12",
    city: "New York",
    pincode: "10001",
  },
];

export default function Account() {
  const [tab, setTab] = useState("profile");
  const { wishlist } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="font-display text-4xl mb-8">My Account</h1>
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition",
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </aside>
        <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
          {tab === "profile" && (
            <div className="space-y-4 max-w-md">
              <h2 className="font-display text-2xl">Profile</h2>
              <Field label="Name" value="Ava Martinez" />
              <Field label="Email" value="ava.martinez@nykaa.co" />
              <Field label="Phone" value="+1 (555) 012-3456" />
              <Field label="Member since" value="January 2024" />
            </div>
          )}
          {tab === "orders" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Recent Orders</h2>
              {mockOrders.map((o) => (
                <div
                  key={o.id}
                  className="p-4 rounded-xl border border-border flex flex-wrap items-center gap-4"
                >
                  <div className="flex-1 min-w-[150px]">
                    <p className="font-mono font-semibold text-sm">{o.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.date} · {o.items} items
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-blush text-rose font-medium">
                    {o.status}
                  </span>
                  <p className="font-semibold">${o.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "wishlist" && (
            <div>
              <h2 className="font-display text-2xl mb-4">
                Wishlist ({wishlist.length})
              </h2>
              {wishlist.length === 0 ? (
                <p className="text-muted-foreground">
                  No items yet.{" "}
                  <Link to="/products" className="underline">
                    Browse products
                  </Link>
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.slice(0, 6).map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`} className="block">
                      <img
                        src={p.image_link}
                        alt=""
                        className="aspect-square rounded-lg object-cover w-full"
                      />
                      <p className="text-sm mt-2 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${Number(p.price).toFixed(2)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === "addresses" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Saved Addresses</h2>
              {mockAddresses.map((a, i) => (
                <div key={i} className="p-4 rounded-xl border border-border">
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {a.line}, {a.city} — {a.pincode}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium mt-0.5">{value}</p>
    </div>
  );
}
