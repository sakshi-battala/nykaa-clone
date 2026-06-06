import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, Sparkles, ChevronDown } from "lucide-react";
import { fetchProducts } from "../services/api";
import { ProductRow } from "../components/ProductRow";
import { Skeleton } from "../components/ui/skeleton";
import { labelForType } from "../utils/categories";
import { useApp } from "../context/AppContext";
import { cn } from "../lib/utils";


export default function ProductDetails() {
  const { id } = useParams();
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const product = products.find((p) => p.id === Number(id));
  const { addToCart, toggleWishlist, inWishlist } = useApp();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><p>Product not found.</p><Link to="/products" className="underline">Back to shop</Link></div>;

  const related = products.filter((p) => p.id !== product.id && (p.brand === product.brand || p.product_type === product.product_type)).slice(0, 8);
  const liked = inWishlist(product.id);
  const description = product.description || "A premium beauty product crafted with care.";
  const longDesc = description.length > 280;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-rose">Home</Link> / <Link to="/products" className="hover:text-rose">Shop</Link> / <span>{labelForType(product.product_type)}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="bg-muted rounded-2xl overflow-hidden">
          <img src={product.image_link} alt={product.name} className="w-full aspect-square object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/800/800`; }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            {product.brand && (
              <span className="inline-block text-xs uppercase tracking-widest px-2.5 py-1 rounded-full bg-blush text-foreground font-medium">{product.brand}</span>
            )}
            {product.product_type && (
              <span className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-full bg-muted">{labelForType(product.product_type)}</span>
            )}
          </div>
          <h1 className="font-display text-3xl lg:text-4xl mt-3">{product.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("size-4", i < Math.round(product.rating ?? 4.5) ? "fill-rose text-rose" : "text-muted-foreground")} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating?.toFixed(1) ?? "4.5"} · 248 reviews</span>
          </div>
          <p className="text-3xl font-semibold mt-5">${Number(product.price).toFixed(2)}</p>

          <div className="mt-5">
            <p className={cn("text-muted-foreground leading-relaxed", !expanded && longDesc && "line-clamp-3")}>{description}</p>
            {longDesc && (
              <button onClick={() => setExpanded(!expanded)} className="mt-2 text-sm text-rose inline-flex items-center gap-1 hover:underline">
                {expanded ? "Read less" : "Read more"} <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} />
              </button>
            )}
          </div>

          {product.product_colors && product.product_colors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">
                Shade: <span className="text-muted-foreground font-normal">{product.product_colors[selectedColor]?.colour_name || "Select"}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.product_colors.slice(0, 12).map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    title={c.colour_name}
                    className={cn(
                      "size-10 rounded-full border-2 transition relative",
                      selectedColor === i ? "border-rose ring-2 ring-rose/30 ring-offset-2 ring-offset-background" : "border-border hover:border-rose"
                    )}
                    style={{ background: c.hex_value }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.tag_list && product.tag_list.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {product.tag_list.slice(0, 6).map((t) => (
                <span key={t} className="px-3 py-1 text-xs rounded-full bg-muted capitalize">{t.replace(/-/g, " ")}</span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-8">
            <button onClick={() => addToCart(product)} className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground hover:bg-rose hover:text-white transition">
              <ShoppingBag className="size-4" /> Add to Cart
            </button>
            <button onClick={() => { addToCart(product); navigate("/checkout"); }} className="flex-1 min-w-[180px] px-6 py-3.5 rounded-full border border-primary hover:bg-primary hover:text-primary-foreground transition">
              Buy Now
            </button>
            <button onClick={() => toggleWishlist(product)} className="size-12 grid place-items-center rounded-full border border-border hover:border-rose transition" aria-label="wishlist">
              <Heart className={cn("size-5", liked && "fill-rose text-rose")} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-border text-xs">
            <div className="flex items-center gap-2"><Truck className="size-4 text-rose" /> Free delivery</div>
            <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-rose" /> 100% authentic</div>
            <div className="flex items-center gap-2"><Sparkles className="size-4 text-rose" /> Cruelty-free</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <ProductRow title="You may also like" products={related} viewAllSearch={product.brand ? { brand: product.brand } : undefined} />
      )}
    </div>
  );
}
