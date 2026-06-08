import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, ChevronDown } from "lucide-react";
import { fetchProducts } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { cn } from "../lib/utils";

const PAGE_SIZE = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [query, setQuery] = useState(initialQ);
  const [brand, setBrand] = useState(searchParams.get("brand") ?? "all");

  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all",
  );
  const [maxPrice, setMaxPrice] = useState(100);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const brands = useMemo<string[]>(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.brand)
            .filter((b): b is string => typeof b === "string" && b.length > 0),
        ),
      ).sort(),
    [products],
  );

  const categories = useMemo<string[]>(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.category)
            .filter((c): c is string => typeof c === "string" && c.length > 0),
        ),
      ).sort(),
    [products],
  );

  const isFiltered =
    query !== "" ||
    brand !== "all" ||
    category !== "all" ||
    maxPrice < 100 ||
    minRating > 0;

  const resetFilters = () => {
    setQuery("");
    setBrand("all");
    setCategory("all");
    setMaxPrice(100);
    setMinRating(0);
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  const filtered = useMemo(() => {
    let r = products.filter((p) => p.image_link && p.name);
    if (query)
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand?.toLowerCase().includes(query.toLowerCase()),
      );
    if (brand !== "all") r = r.filter((p) => p.brand === brand);
    if (category !== "all")
      r = r.filter(
        (p) => p.category === category || p.product_type === category,
      );
    r = r.filter((p) => Number(p.price) <= maxPrice);
    if (minRating > 0) r = r.filter((p) => (p.rating ?? 0) >= minRating);

    switch (sort) {
      case "price-asc":
        r = [...r].sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        r = [...r].sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name-asc":
        r = [...r].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        r = [...r].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    return r;
  }, [products, query, brand, category, maxPrice, minRating, sort]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query, brand, category, maxPrice, minRating, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 antialiased">
      {/* Top Section: Title & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Catalog
          </h1>
          <p className="text-muted-foreground mt-2 text-sm italic">
            {filtered.length} curated items
          </p>
        </div>

        <div className="relative group max-w-md w-full">
          <Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search products, brands, styles..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/40 border border-transparent focus:bg-background focus:border-border focus:ring-4 focus:ring-primary/5 transition-all outline-none"
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-border/50">
        <FilterSelect
          label="Category"
          value={category}
          onChange={setCategory}
          options={["all", ...categories]}
        />
        <FilterSelect
          label="Brand"
          value={brand}
          onChange={setBrand}
          options={["all", ...brands]}
        />
        <FilterSelect
          label="Min Rating"
          value={minRating.toString()}
          onChange={(v) => setMinRating(Number(v))}
          options={["0", "3", "4", "4.5"]}
          isRating
        />

        <div className="flex items-center gap-4 px-4 py-2 bg-muted/30 rounded-xl border border-border/40">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Max: ${maxPrice}
          </span>
          <input
            type="range"
            min={5}
            max={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-24 sm:w-32 accent-primary h-1.5 rounded-full cursor-pointer"
          />
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <RotateCcw className="size-4" /> Clear
            </button>
          )}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-background border border-border px-4 py-2 rounded-xl text-sm font-medium outline-none hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low-High</option>
            <option value="price-desc">Price: High-Low</option>
          </select>
        </div>
      </div>

      {/* Optimized Grid */}
      <div className="min-h-[60vh]">
        {isError && (
          <p className="text-center text-rose-500 py-20">
            Something went wrong. Please refresh.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] rounded-3xl bg-muted animate-pulse"
                />
              ))
            : pageItems.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-muted p-6 rounded-full mb-4">
              <Search className="size-10 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No matches found
            </h3>
            <p className="text-muted-foreground mt-1">
              Try broadening your filters or searching for something else.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

     
      {/* Pagination */}
      {Math.ceil(filtered.length / PAGE_SIZE) > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage((p) => p - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-xl border border-border bg-background disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition"
          >
            Prev
          </button>

          {Array.from({
            length: Math.ceil(filtered.length / PAGE_SIZE),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setPage(i + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={cn(
                "size-11 rounded-xl text-sm font-semibold transition-all duration-200",
                page === i + 1
                  ? "bg-rose text-white shadow-lg shadow-rose/25 scale-105"
                  : "bg-muted hover:bg-muted/70",
              )}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === Math.ceil(filtered.length / PAGE_SIZE)}
            onClick={() => {
              setPage((p) => p + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-xl border border-border bg-background disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  isRating = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  isRating?: boolean;
}) {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-background border border-border pl-4 pr-10 py-2 rounded-xl text-sm font-medium outline-none hover:border-muted-foreground/40 transition-all cursor-pointer capitalize"
      >
        <option value={options[0]}>
          {label}: {isRating && value !== "0" ? `${value}★` : "All"}
        </option>
        {options.slice(1).map((opt) => (
          <option key={opt} value={opt}>
            {isRating ? `${opt} Stars & Up` : opt}
          </option>
        ))}
      </select>
      <ChevronDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
    </div>
  );
}
