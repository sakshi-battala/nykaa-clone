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
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border/60 transition-all hover:shadow-2xl hover:-translate-y-1 duration-300 h-full flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted relative">
          <div className="aspect-square overflow-hidden bg-muted relative">
            <img
              src={getProductImage(product)}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getFallbackImage(product);
              }}
            />
          </div>
          {product.product_type && (
            <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-background/90 backdrop-blur font-medium">
              {labelForType(product.product_type)}
            </span>
          )}
        </div>
      </Link>
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="size-9 rounded-full bg-background/90 backdrop-blur grid place-items-center hover:bg-background transition shadow"
          aria-label="wishlist"
        >
          <Heart className={cn("size-4", liked && "fill-rose text-rose")} />
        </button>
        <Link
          to={`/product/${product.id}`}
          className="size-9 rounded-full bg-background/90 backdrop-blur grid place-items-center hover:bg-background transition shadow opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 duration-200"
          aria-label="quick view"
        >
          <Eye className="size-4" />
        </Link>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {product.brand}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm mt-1 line-clamp-2 min-h-[2.5rem] hover:text-rose transition">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Star className="size-3 fill-rose text-rose" />
          <span>{product.rating?.toFixed(1) ?? "4.5"}</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="font-semibold">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center hover:bg-rose hover:text-white transition"
            aria-label="add to cart"
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
