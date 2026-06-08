import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Truck, ShieldCheck, Gift } from "lucide-react";
import { fetchProducts } from "../services/api";
import { HeroCarousel } from "../components/HeroCarousel";
import { ProductRow } from "../components/ProductRow";

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const byType = (type: string) =>
    products.filter((p) => p.product_type === type).slice(0, 12);

  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean)),
  ).slice(0, 10) as string[];

  return (
    <div>
      <HeroCarousel />
      {/* tags under carousel  */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {[
            { icon: Truck, label: "Free shipping over $50" },
            { icon: ShieldCheck, label: "100% authentic products" },
            { icon: Gift, label: "Free samples with every order" },
            { icon: Sparkles, label: "Cruelty-free & vegan" },
          ].map((v, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-5 text-sm">
              <v.icon className="size-5 text-rose shrink-0" />{" "}
              <span className="line-clamp-1">{v.label}</span>
            </div>
          ))}
        </div>
      </section>
      <ProductRow
        title="Trending Lipsticks"
        subtitle="The shades everyone's wearing"
        products={byType("lipstick")}
        loading={isLoading}
        viewAllSearch={{ category: "lipstick" }}
      />
      <ProductRow
        title="Best Foundations"
        subtitle="Find your perfect base"
        products={byType("foundation")}
        loading={isLoading}
        viewAllSearch={{ category: "foundation" }}
      />
      {/* nyka code and off details  */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 my-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-500 to-pink-400 text-white">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 lg:p-14">
              <p className="uppercase tracking-widest text-xs opacity-80">
                Limited time
              </p>
              <h2 className="font-display text-3xl lg:text-5xl mt-3 leading-tight">
                Use code{" "}
                <span className="underline decoration-wavy">NYKAA10</span>
                <br />
                for 10% off
              </h2>
              <p className="mt-4 opacity-90 max-w-sm">
                First-time shoppers get a sweet welcome. Stack with seasonal
                sale.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-full bg-white text-rose-600 font-medium hover:opacity-90"
              >
                Start shopping
              </Link>
            </div>
            <div className="hidden md:block h-full">
              <img
                src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      .{/* shop by brands */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <div className="mb-8">
          <h2 className="font-display text-3xl lg:text-4xl">
            Top Beauty Brands
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Trusted by beauty lovers worldwide
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {brands.map((b) => (
            <Link
              key={b}
              to={`/products?brand=${encodeURIComponent(b)}`}
              className="aspect-[3/2] grid place-items-center rounded-xl border border-border bg-card hover:border-rose hover:text-rose transition uppercase tracking-widest text-xs font-medium text-center px-3"
            >
              {b}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
