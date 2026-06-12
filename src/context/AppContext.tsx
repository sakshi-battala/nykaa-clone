import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { CartItem, Product } from "../types/product";

// Internal helper to determine if two cart items have the identical variant shade selection
const isSameItem = (
  productId: number,
  selectedShade: any,
  itemToCompare: CartItem,
) => {
  return (
    itemToCompare.product.id === productId &&
    itemToCompare.selectedShade?.colour_name === selectedShade?.colour_name
  );
};

interface AppState {
  cart: CartItem[];
  wishlist: Product[];
  cartOpen: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  // Updated signatures to accept explicit shade tracking parameters
  addToCart: (p: Product & { selectedShade?: any }, qty?: number) => void;
  removeFromCart: (id: number, selectedShade?: any) => void;
  updateQty: (id: number, qty: number, selectedShade?: any) => void;
  clearCart: () => void;
  toggleWishlist: (p: Product) => void;
  inWishlist: (id: number) => boolean;
  removeFromWishlist: (id: number) => void;
  setCartOpen: (v: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
}

const Ctx = createContext<AppState | null>(null);

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => readLS("nykaa_cart", []));
  const [wishlist, setWishlist] = useState<Product[]>(() =>
    readLS("nykaa_wishlist", []),
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("nykaa_theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    localStorage.setItem("nykaa_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("nykaa_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem("nykaa_theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const addToCart = (
    pWithShade: Product & { selectedShade?: any },
    qty = 1,
  ) => {
    const { selectedShade, ...product } = pWithShade;

    setCart((prev) => {
      // Find matches where both the product ID AND shade string names correspond
      const found = prev.find((c) => isSameItem(product.id, selectedShade, c));

      if (found) {
        return prev.map((c) =>
          isSameItem(product.id, selectedShade, c)
            ? { ...c, quantity: c.quantity + qty }
            : c,
        );
      }

      // Keep track of the specific chosen variant profile on this collection item
      return [...prev, { product, quantity: qty, selectedShade }];
    });

    const displayTitle = selectedShade
      ? `${product.name} (${selectedShade.colour_name})`
      : product.name;

    toast.success("Added to cart", { description: displayTitle });
    setCartOpen(true);
  };

  const removeFromCart = (id: number, selectedShade?: any) => {
    setCart((prev) => prev.filter((c) => !isSameItem(id, selectedShade, c)));
    toast("Removed from cart");
  };

  const updateQty = (id: number, qty: number, selectedShade?: any) => {
    if (qty <= 0) return removeFromCart(id, selectedShade);
    setCart((prev) =>
      prev.map((c) =>
        isSameItem(id, selectedShade, c) ? { ...c, quantity: qty } : c,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (p: Product) => {
    setWishlist((prev) => {
      if (prev.find((w) => w.id === p.id)) {
        toast("Removed from wishlist");
        return prev.filter((w) => w.id !== p.id);
      }
      toast.success("Added to wishlist", { description: p.name });
      return [...prev, p];
    });
  };
  const inWishlist = (id: number) => wishlist.some((w) => w.id === id);
  const removeFromWishlist = (id: number) =>
    setWishlist((p) => p.filter((w) => w.id !== id));

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const cartSubtotal = cart.reduce(
    (s, c) => s + Number(c.product.price || 0) * c.quantity,
    0,
  );

  return (
    <Ctx.Provider
      value={{
        cart,
        wishlist,
        cartOpen,
        theme,
        toggleTheme,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleWishlist,
        inWishlist,
        removeFromWishlist,
        setCartOpen,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}
