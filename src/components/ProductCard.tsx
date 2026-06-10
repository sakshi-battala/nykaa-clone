import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import type { Product } from "../types/product";
import { useApp } from "../context/AppContext";
import { labelForType } from "../utils/categories";
import { cn } from "../lib/utils";
import { getFallbackImage, getProductImage } from "../utils/fallbackImages";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useApp();
  const liked = inWishlist(product.id);

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border/40 transition-all hover:shadow-md hover:border-border/80 duration-200 h-full flex flex-col">
      {/* Product Image Section */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-muted/40 relative border-b border-border/10">
          <img
            src={getProductImage(product)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getFallbackImage(product);
            }}
          />

          {product.product_type && (
            <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-background/90 backdrop-blur-xs font-semibold text-foreground/80">
              {labelForType(product.product_type)}
            </span>
          )}
        </div>
      </Link>

      {/* Floated Utilities Layer */}
      <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="size-7.5 rounded-full bg-background/90 backdrop-blur-xs grid place-items-center hover:bg-background transition shadow-sm active:scale-95"
          aria-label="wishlist"
        >
          <Heart
            className={cn(
              "size-3.5 text-muted-foreground transition-colors",
              liked && "fill-rose text-rose",
            )}
          />
        </button>
        <Link
          to={`/product/${product.id}`}
          className="size-7.5 rounded-full bg-background/90 backdrop-blur-xs grid place-items-center hover:bg-background transition shadow-sm md:opacity-0 md:group-hover:opacity-100 md:-translate-y-1 md:group-hover:translate-y-0 duration-200"
          aria-label="quick view"
        >
          <Eye className="size-3.5 text-muted-foreground" />
        </Link>
      </div>

      {/* Content Meta Information Area */}
      <div className="p-2.5 flex-1 flex flex-col gap-1">
        {product.brand && (
          <p className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground/80 truncate">
            {product.brand}
          </p>
        )}

        <Link to={`/product/${product.id}`} className="flex-1">
          <h3 className="font-medium text-xs tracking-tight text-foreground/90 line-clamp-2 min-h-[2rem] leading-tight hover:text-rose transition">
            {product.name}
          </h3>
        </Link>

        {/* Rating Row */}
        <div className="flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground/90">
          <Star className="size-2.5 fill-rose text-rose stroke-rose" />
          <span className="text-foreground/90">
            {product.rating?.toFixed(1) ?? "4.5"}
          </span>
        </div>

        {/* Pricing & Cart Footer Action Row */}
        <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-border/30">
          <span className="font-bold text-sm text-foreground">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="size-7.5 rounded-full bg-primary text-primary-foreground grid place-items-center hover:bg-rose hover:text-white transition active:scale-95"
            aria-label="add to cart"
          >
            <ShoppingBag className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
