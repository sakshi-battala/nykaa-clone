import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { fetchProducts } from "../services/api";
import { ProductCard } from "../components/ProductCard";

const PAGE_SIZE = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialBrand = searchParams.get("brand") ?? "all";
  const initialCategory = searchParams.get("category") ?? "all";

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const [query, setQuery] = useState(initialQ);
  const [brand, setBrand] = useState(initialBrand);
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(100);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const brands = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.brand).filter(Boolean)),
      ).sort() as string[],
    [products],
  );
  const categories = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.category).filter(Boolean)),
      ).sort() as string[],
    [products],
  );

  const filtered = useMemo(() => {
    let r = products;
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSearch = (val: string) => {
    setQuery(val);
    setPage(1);
    const next = new URLSearchParams(searchParams);
    if (val) next.set("q", val);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Shop All</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} products
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search"
              className="pl-9 pr-3 py-2 rounded-full bg-muted text-sm w-56 focus:outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-full bg-muted text-sm focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="flex items-center gap-2 font-medium">
            <SlidersHorizontal className="size-4" /> Filters
          </div>

          <FilterGroup title="Category">
            <Select
              value={category}
              onChange={setCategory}
              options={[
                ["all", "All"],
                ...categories.map((c) => [c, c] as [string, string]),
              ]}
            />
          </FilterGroup>

          <FilterGroup title="Brand">
            <Select
              value={brand}
              onChange={setBrand}
              options={[
                ["all", "All"],
                ...brands.map((b) => [b, b] as [string, string]),
              ]}
            />
          </FilterGroup>

          <FilterGroup title={`Max Price: $${maxPrice}`}>
            <input
              type="range"
              min={5}
              max={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-rose"
            />
          </FilterGroup>

          <FilterGroup title="Rating">
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`flex-1 py-1.5 rounded-md text-xs border ${minRating === r ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          </FilterGroup>
        </aside>

        <div>
          {isError && (
            <p className="text-destructive">Failed to load products.</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {isLoading &&
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl bg-muted animate-pulse"
                />
              ))}
            {!isLoading &&
              pageItems.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No products match your filters.
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`size-9 rounded-full text-sm ${page === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-muted text-sm border-0 focus:outline-none capitalize"
    >
      {options.map(([v, l]) => (
        <option key={v} value={v} className="capitalize">
          {l}
        </option>
      ))}
    </select>
  );
}
