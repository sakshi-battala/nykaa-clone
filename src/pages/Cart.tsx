import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getFallbackImage, getProductImage } from "../utils/fallbackImages";

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartSubtotal } = useApp();
  const delivery = cartSubtotal > 50 || cartSubtotal === 0 ? 0 : 5;
  const tax = +(cartSubtotal * 0.08).toFixed(2);
  const total = cartSubtotal + delivery + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="font-display text-4xl mb-8">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-20 max-w-md mx-auto">
          <div className="size-24 mx-auto rounded-full bg-blush grid place-items-center">
            <ShoppingBag className="size-10 text-rose" />
          </div>
          <h2 className="font-display text-2xl mt-6">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/products"
            className="inline-block mt-6 px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-rose hover:text-white transition"
          >
            Shop now
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-4">
            {cart.map((item) => {
              // Creating a unique compound layout string key to separate same-product variants safely
              const shadeName = item.selectedShade?.colour_name || "default";
              const uniqueCartId = `${item.product.id}-${shadeName}`;

              return (
                <div
                  key={uniqueCartId}
                  className="flex gap-4 p-4 rounded-xl border border-border bg-card"
                >
                  <img
                    src={getProductImage(item.product)}
                    alt={item.product.name}
                    className="size-28 rounded-lg object-cover bg-muted shrink-0"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getFallbackImage(item.product);
                    }}
                  />{" "}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase text-muted-foreground">
                      {item.product.brand}
                    </p>
                    <Link
                      to={`/product/${item.product.id}`}
                      className="font-medium hover:text-rose block truncate text-base"
                    >
                      {item.product.name}
                    </Link>

                    {/* SHADE SELECTION ACCORDION BADGE DISPLAY */}
                    {item.selectedShade && (
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <span
                          className="size-3.5 rounded-full border border-black/10 inline-block shrink-0 shadow-sm"
                          style={{
                            backgroundColor: item.selectedShade.hex_value,
                          }}
                        />
                        <span className="truncate">
                          Shade:{" "}
                          <strong className="font-medium text-foreground">
                            {item.selectedShade.colour_name}
                          </strong>
                        </span>
                      </div>
                    )}

                    <p className="mt-2 font-semibold">
                      ${Number(item.product.price).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-border rounded-full bg-background">
                        <button
                          onClick={() =>
                            updateQty(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedShade,
                            )
                          }
                          className="size-8 grid place-items-center hover:text-rose transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedShade,
                            )
                          }
                          className="size-8 grid place-items-center hover:text-rose transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.selectedShade)
                        }
                        className="text-sm text-muted-foreground hover:text-destructive inline-flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="size-4" /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-right shrink-0">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <aside className="bg-muted/40 rounded-2xl p-6 h-fit lg:sticky lg:top-24 space-y-4">
            <h2 className="font-display text-2xl">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="block text-center w-full py-3 rounded-full bg-primary text-primary-foreground hover:bg-rose hover:text-white transition font-medium"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
