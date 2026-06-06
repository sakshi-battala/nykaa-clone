import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils"; 

interface Slide { kicker: string; title: string; subtitle: string; cta: string; href: string; search?: Record<string, string>; gradient: string; image: string }

const slides: Slide[] = [
  {
    kicker: "Limited time",
    title: "Summer Beauty Sale",
    subtitle: "Up to 50% off on bestselling beauty & skincare.",
    cta: "Shop the sale",
    href: "/products",
    gradient: "from-pink-200 via-rose-100 to-amber-100",
    image: "https://images.unsplash.com/photo-1522335789203-aaa2f6b4f30b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    kicker: "Curated edit",
    title: "Luxury Makeup Collection",
    subtitle: "Iconic shades from the world's finest houses.",
    cta: "Discover luxury",
    href: "/products",
    search: { category: "lipstick" },
    gradient: "from-rose-300 via-rose-100 to-pink-50",
    image: "https://images.unsplash.com/photo-1599733589046-8a35aeed16ad?auto=format&fit=crop&w=1600&q=80",
  },
  {
    kicker: "Just dropped",
    title: "New Arrivals",
    subtitle: "Fresh launches across lips, eyes & complexion.",
    cta: "Shop new",
    href: "/products",
    gradient: "from-amber-100 via-orange-100 to-rose-100",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    kicker: "Trusted by millions",
    title: "Top Beauty Brands",
    subtitle: "Maybelline, L'Oréal, Covergirl, Revlon & more.",
    cta: "Browse brands",
    href: "/products",
    gradient: "from-stone-200 via-rose-50 to-pink-100",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=80",
  },
  {
    kicker: "Self-care",
    title: "Skincare Essentials",
    subtitle: "Glow-getting routines for every skin type.",
    cta: "Shop skincare",
    href: "/products",
    gradient: "from-emerald-100 via-rose-50 to-amber-50",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80",
  },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);
  const paused = useRef(false);

  useEffect(() => {
    const t = setInterval(() => { if (!paused.current) setI((p) => (p + 1) % slides.length); }, 4000);
    return () => clearInterval(t);
  }, []);

  const go = (n: number) => setI((n + slides.length) % slides.length);

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        startX.current = null;
      }}
    >
      <div className="relative h-[420px] md:h-[520px] lg:h-[560px]">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              idx === i ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br", s.gradient)} />
            <img src={s.image} alt="" loading={idx === 0 ? "eager" : "lazy"} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-70" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
              <div className={cn("max-w-xl text-foreground transition-all duration-700", idx === i ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}>
                <span className="inline-flex items-center text-xs uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-background/80 backdrop-blur">{s.kicker}</span>
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mt-5 leading-[1.05]">{s.title}</h1>
                <p className="mt-4 text-base md:text-lg text-foreground/75 max-w-md">{s.subtitle}</p>
                <Link to={`${s.href}${s.search ? "?" + new URLSearchParams(s.search).toString() : ""}`} className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 rounded-full bg-primary text-primary-foreground hover:bg-rose hover:text-white transition shadow-lg">
                  {s.cta} <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => go(i - 1)} aria-label="Previous" className="hidden md:grid absolute left-4 top-1/2 -translate-y-1/2 size-11 place-items-center rounded-full bg-background/90 hover:bg-background shadow-lg transition">
        <ChevronLeft className="size-5" />
      </button>
      <button onClick={() => go(i + 1)} aria-label="Next" className="hidden md:grid absolute right-4 top-1/2 -translate-y-1/2 size-11 place-items-center rounded-full bg-background/90 hover:bg-background shadow-lg transition">
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => go(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={cn("h-2 rounded-full transition-all", idx === i ? "w-8 bg-primary" : "w-2 bg-foreground/30 hover:bg-foreground/50")}
          />
        ))}
      </div>
    </section>
  );
}
