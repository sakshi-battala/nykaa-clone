import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { CartItem, Product } from "../types/product";

interface AppState {
  cart: CartItem[];
  wishlist: Product[];
  cartOpen: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
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

  const addToCart = (p: Product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((c) => c.product.id === p.id);
      if (found)
        return prev.map((c) =>
          c.product.id === p.id ? { ...c, quantity: c.quantity + qty } : c,
        );
      return [...prev, { product: p, quantity: qty }];
    });
    toast.success("Added to cart", { description: p.name });
    setCartOpen(true);
  };
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((c) => c.product.id !== id));
    toast("Removed from cart");
  };
  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((c) => (c.product.id === id ? { ...c, quantity: qty } : c)),
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
