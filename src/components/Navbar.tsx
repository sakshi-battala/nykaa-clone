import { NavLink, useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import { fetchProducts } from "../services/api";
import { cn } from "../lib/utils";
import type { Product } from "../types/product";

// Imported image utility functions from your helpers file
import { getFallbackImage, getProductImage } from "../utils/fallbackImages"; // Update this path to match your folder setup

interface Suggestion {
  kind: "brand" | "product";
  label: string;
  sublabel?: string;
  href: string;
  image?: string;
}

export function Navbar() {
  const { cartCount, wishlist, setCartOpen, theme, toggleTheme } = useApp();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [hi, setHi] = useState(0);

  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "transition py-2 md:py-0",
      isActive ? "text-rose font-medium" : "hover:text-rose",
    );

  const suggestions = useMemo<Suggestion[]>(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];

    const brands = new Set<string>();
    const productHits: Suggestion[] = [];

    for (const p of products) {
      if (p.brand && p.brand.toLowerCase().includes(term)) {
        brands.add(p.brand);
      }

      if (productHits.length < 6 && p.name.toLowerCase().includes(term)) {
        productHits.push({
          kind: "product",
          label: p.name,
          sublabel: p.brand ?? undefined,
          href: `/product/${p.id}`,
          // Fix: Uses your helper function to resolve fallback assets if image_link is missing/broken
          image: getProductImage(p),
        });
      }
    }

    const brandSugs: Suggestion[] = Array.from(brands)
      .slice(0, 4)
      .map((b) => ({
        kind: "brand",
        label: b,
        sublabel: "Brand",
        href: `/products?brands=${encodeURIComponent(b)}`,
      }));

    return [...brandSugs, ...productHits].slice(0, 10);
  }, [q, products]);

  useEffect(() => {
    setHi(0);
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setFocus(false);
      }
    };

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (suggestions[hi]) {
      go(suggestions[hi]);
      return;
    }

    navigate(`/products?q=${encodeURIComponent(q)}`);
    setFocus(false);
    setOpen(false);
  };

  const go = (s: Suggestion) => {
    setFocus(false);
    setOpen(false);
    setQ("");
    navigate(s.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Escape") {
      setFocus(false);
    }
  };

  // Safe image element error handling boundary state function
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    product: Product,
  ) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = getFallbackImage(product);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-lg border-b border-border">
      {/* Promo Announcement Header */}
      <div className="bg-primary text-primary-foreground text-center text-[10px] sm:text-xs py-2 tracking-wider uppercase">
        <Sparkles className="inline size-3 mr-1.5" />
        Free shipping over $50 · New arrivals dropping weekly
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 lg:gap-6">
          {/* Mobile Menu Action Toggle */}
          <button
            className="lg:hidden p-1 -ml-1 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          {/* Logo Brand Title */}
          <NavLink
            to="/"
            className="font-display text-2xl lg:text-3xl font-bold tracking-tight whitespace-nowrap"
          >
            <span className="text-rose">Nykaa</span>
          </NavLink>

          {/* Large Screen Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/products" end className={navClass}>
              Shop All
            </NavLink>
          </nav>

          {/* Desktop Search Engine Dropdown Field Layout */}
          <div
            ref={boxRef}
            className="relative flex-1 max-w-md hidden md:block"
          >
            <form onSubmit={submit}>
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocus(true)}
                onKeyDown={onKey}
                placeholder="Search brands or products..."
                className="w-full pl-9 pr-3 py-2 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-rose/40"
              />
            </form>

            {/* Desktop Dynamic Floating Suggestion Layer View */}
            {focus && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-popover text-popover-foreground border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onMouseEnter={() => setHi(i)}
                    onClick={() => go(s)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition",
                      hi === i && "bg-muted",
                    )}
                  >
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.label}
                        onError={(e) => {
                          const product = products.find(
                            (p) => `/product/${p.id}` === s.href,
                          );

                          if (product) {
                            handleImageError(e, product);
                          }
                        }}
                        className="size-8 rounded object-cover bg-muted"
                      />
                    ) : (
                      <div className="size-9 rounded grid place-items-center bg-muted">
                        <Search className="size-4 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{s.label}</p>
                      {s.sublabel && (
                        <p className="text-xs text-muted-foreground truncate">
                          {s.sublabel}
                        </p>
                      )}
                    </div>

                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                      {s.kind}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Controls Panel Bar Left */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="size-9 grid place-items-center rounded-full hover:bg-muted transition"
              aria-label="theme"
            >
              {theme === "dark" ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </button>

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                cn(
                  "size-9 grid place-items-center rounded-full hover:bg-muted relative",
                  isActive && "text-rose",
                )
              }
              aria-label="wishlist"
            >
              <Heart className="size-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 size-4 text-[10px] rounded-full bg-rose text-white grid place-items-center animate-in scale-in duration-100">
                  {wishlist.length}
                </span>
              )}
            </NavLink>

            <button
              onClick={() => setCartOpen(true)}
              className="size-9 grid place-items-center rounded-full hover:bg-muted relative"
              aria-label="cart"
            >
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 size-4 text-[10px] rounded-full bg-rose text-white grid place-items-center animate-in scale-in duration-100">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Submenu Drawer Menu Overlay System */}
        {open && (
          <nav className="lg:hidden flex flex-col pb-4 border-t border-border/40 pt-3 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile View Port Dynamic Category Input System */}
            <div className="relative mb-4 md:hidden">
              <form onSubmit={submit}>
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setFocus(true)}
                  onKeyDown={onKey}
                  placeholder="Search brands or products..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-rose/40"
                />
              </form>

              {/* Mobile View Dropdown Element Suggestions Portal layout container */}
              {focus && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-popover text-popover-foreground border border-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setHi(i)}
                      onClick={() => go(s)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition",
                        hi === i && "bg-muted",
                      )}
                    >
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.label}
                          onError={(e) => {
                            const product = products.find(
                              (p) => `/product/${p.id}` === s.href,
                            );

                            if (product) {
                              handleImageError(e, product);
                            }
                          }}
                          className="size-9 rounded object-cover bg-muted"
                        />
                      ) : (
                        <div className="size-8 rounded grid place-items-center bg-muted">
                          <Search className="size-3.5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{s.label}</p>
                        {s.sublabel && (
                          <p className="text-[10px] text-muted-foreground truncate">
                            {s.sublabel}
                          </p>
                        )}
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {s.kind}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Screen Hyperlinks Links lists */}
            <div className="flex flex-col gap-1 px-1">
              <NavLink
                to="/"
                end
                onClick={() => setOpen(false)}
                className={navClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                end
                onClick={() => setOpen(false)}
                className={navClass}
              >
                Shop All
              </NavLink>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
