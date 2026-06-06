import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Product } from "../types/product";
import { ProductCard } from "../components/ProductCard";
import { Skeleton } from "../components/ui/skeleton";

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  loading?: boolean;
  viewAllSearch?: Record<string, string>;
}

export function ProductRow({
  title,
  subtitle,
  products,
  loading,
  viewAllSearch,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            className="hidden md:grid size-9 place-items-center rounded-full border border-border hover:border-rose hover:text-rose transition"
            aria-label="prev"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="hidden md:grid size-9 place-items-center rounded-full border border-border hover:border-rose hover:text-rose transition"
            aria-label="next"
          >
            <ChevronRight className="size-4" />
          </button>
          <Link
            to={`/products${viewAllSearch ? "?" + new URLSearchParams(viewAllSearch).toString() : ""}`}
            className="inline-flex items-center gap-1 text-sm px-4 py-2 rounded-full hover:text-rose transition whitespace-nowrap"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-[200px] md:w-[240px] space-y-3"
            >
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        {!loading &&
          products.map((p) => (
            <div
              key={p.id}
              className="snap-start shrink-0 w-[200px] md:w-[240px]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        {!loading && products.length === 0 && (
          <p className="text-sm text-muted-foreground py-10">
            No products yet.
          </p>
        )}
      </div>
    </section>
  );
}
