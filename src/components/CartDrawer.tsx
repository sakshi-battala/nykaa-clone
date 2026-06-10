import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { cn } from "../lib/utils";
import { getFallbackImage, getProductImage } from "../utils/fallbackImages";

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    updateQty,
    removeFromCart,
    cartSubtotal,
  } = useApp();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity",
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[440px] bg-background z-50 shadow-2xl transition-transform duration-300 flex flex-col",
          cartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-xl">Your Cart ({cart.length})</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="size-8 grid place-items-center rounded-full hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 && (
            <div className="text-center py-16">
              <div className="size-20 mx-auto rounded-full bg-blush grid place-items-center">
                <ShoppingBag className="size-9 text-rose" />
              </div>
              <p className="mt-5 font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some beauty essentials to get started.
              </p>
              <Link
                to="/products"
                onClick={() => setCartOpen(false)}
                className="inline-block mt-6 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm"
              >
                Start shopping
              </Link>
            </div>
          )}
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <img
                src={getProductImage(item.product)}
                alt={item.product.name}
                className="size-20 rounded-md object-cover bg-muted"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackImage(item.product);
                }}
              />{" "}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {item.product.brand}
                </p>
                <p className="text-sm font-medium line-clamp-1">
                  {item.product.name}
                </p>
                <p className="text-sm mt-1 font-semibold">
                  ${Number(item.product.price).toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQty(item.product.id, item.quantity - 1)
                    }
                    className="size-7 grid place-items-center rounded border border-border"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="text-sm w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQty(item.product.id, item.quantity + 1)
                    }
                    className="size-7 grid place-items-center rounded border border-border"
                  >
                    <Plus className="size-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="ml-auto text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <footer className="p-5 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-base">
                ${cartSubtotal.toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCartOpen(false)}
                className="py-3 rounded-full border border-border text-sm hover:border-rose transition"
              >
                Continue Shopping
              </button>
              <Link
                to="/cart"
                onClick={() => setCartOpen(false)}
                className="text-center py-3 rounded-full border border-primary text-sm hover:bg-primary hover:text-primary-foreground transition"
              >
                Go to Cart
              </Link>
            </div>
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="block text-center w-full py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-rose hover:text-white transition"
            >
              Checkout · ${cartSubtotal.toFixed(2)}
            </Link>
          </footer>
        )}
      </aside>
    </>
  );
}
