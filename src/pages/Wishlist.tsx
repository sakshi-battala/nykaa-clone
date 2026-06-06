import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="font-display text-4xl mb-8">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-20 max-w-md mx-auto">
          <div className="size-24 mx-auto rounded-full bg-blush grid place-items-center">
            <Heart className="size-10 text-rose" />
          </div>
          <h2 className="font-display text-2xl mt-6">Your wishlist is empty</h2>
          <p className="text-muted-foreground mt-2">
            Save your favorites here to keep track of products you love.
          </p>
          <Link
            to="/products"
            className="inline-block mt-6 px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-rose hover:text-white transition"
          >
            Discover products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border overflow-hidden bg-card"
            >
              <Link to={`/product/${p.id}`}>
                <img
                  src={p.image_link}
                  alt={p.name}
                  className="aspect-square w-full object-cover"
                />
              </Link>
              <div className="p-4">
                <p className="text-xs uppercase text-muted-foreground">
                  {p.brand}
                </p>
                <p className="text-sm font-medium line-clamp-2 mt-1">
                  {p.name}
                </p>
                <p className="font-semibold mt-2">
                  ${Number(p.price).toFixed(2)}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      addToCart(p);
                      removeFromWishlist(p.id);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-primary text-primary-foreground text-xs hover:bg-rose hover:text-white transition"
                  >
                    <ShoppingBag className="size-3" /> Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(p.id)}
                    className="size-9 grid place-items-center rounded-full border border-border hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
