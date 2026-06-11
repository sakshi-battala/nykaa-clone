import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { fetchProducts } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { FilterSidebar } from "../components/FiltersSidebar";
import { Pagination } from "../components/Pagination";

const ITEMS_PER_PAGE = 12;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State Sync
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // Parse comma-separated strings from URL into clean arrays for state
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const brandsParam = searchParams.get("brands");
    return brandsParam ? brandsParam.split(",") : [];
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const catsParam = searchParams.get("categories");
    return catsParam ? catsParam.split(",") : [];
  });

  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("maxPrice") ?? "100"),
  );
  const [minRating, setMinRating] = useState(
    Number(searchParams.get("minRating") ?? "0"),
  );
  const [sort, setSort] = useState(searchParams.get("sort") ?? "featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination Active State Tracker
  const currentPage = Number(searchParams.get("page") ?? "1");
  const debouncedQuery = useDebounce(query, 300);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const brands = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(),
    [products],
  );
  const categories = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.category).filter(Boolean)),
      ).sort(),
    [products],
  );

  // Step 1: Compute fully matched data items first so we know total available length
  const filteredProducts = useMemo(() => {
    let r = products.filter((p) => p.name);

    if (debouncedQuery) {
      r = r.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(debouncedQuery.toLowerCase()),
      );
    }
    if (selectedBrands.length > 0) {
      r = r.filter((p) => selectedBrands.includes(p.brand ?? ""));
    }
    if (selectedCategories.length > 0) {
      r = r.filter(
        (p) =>
          selectedCategories.includes(p.category ?? "") ||
          selectedCategories.includes(p.product_type ?? ""),
      );
    }
    if (minRating > 0) {
      r = r.filter((p) => (p.rating ?? 0) >= minRating);
    }
    if (maxPrice < 100) {
      r = r.filter((p) => Number(p.price ?? 0) <= maxPrice);
    }

    switch (sort) {
      case "price-asc":
        return [...r].sort((a, b) => Number(a.price) - Number(b.price));
      case "price-desc":
        return [...r].sort((a, b) => Number(b.price) - Number(a.price));
      case "name-asc":
        return [...r].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...r].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return r;
    }
  }, [
    products,
    debouncedQuery,
    selectedBrands,
    selectedCategories,
    maxPrice,
    minRating,
    sort,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Keep track of active filters to catch when a filter was altered
  const filterSignature = `${debouncedQuery}-${selectedBrands.join(",")}-${selectedCategories.join(",")}-${maxPrice}-${minRating}-${sort}`;
  const lastFilters = useRef(filterSignature);

  // Sync state changes with URL Search Params cleanly
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);

    // Serialize array vectors into clean comma-delimited strings
    if (selectedBrands.length > 0) {
      params.set("brands", selectedBrands.join(","));
    }
    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    }

    if (maxPrice < 100) params.set("maxPrice", maxPrice.toString());
    if (minRating > 0) params.set("minRating", minRating.toString());
    if (sort !== "featured") params.set("sort", sort);

    // Pagination auto-reset and safety boundary checks
    let targetPage = currentPage;
    if (lastFilters.current !== filterSignature) {
      targetPage = 1;
      lastFilters.current = filterSignature;
    } else if (totalPages > 0 && currentPage > totalPages) {
      targetPage = totalPages;
    }

    if (targetPage > 1) params.set("page", targetPage.toString());

    setSearchParams(params, { replace: true });
  }, [
    debouncedQuery,
    selectedBrands,
    selectedCategories,
    maxPrice,
    minRating,
    sort,
    currentPage,
    totalPages,
    filterSignature,
    setSearchParams,
  ]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const isFiltered =
    query !== "" ||
    selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    maxPrice < 100 ||
    minRating > 0;

  const resetFilters = () => {
    setQuery("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setMaxPrice(100);
    setMinRating(0);
    setSort("featured");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Step 2: Slice the completely filtered data array specifically for the current active page chunk
  const paginatedProducts = useMemo(() => {
    const safePage = currentPage > totalPages ? 1 : currentPage;
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage, totalPages]);

  const handlePageChange = (pageNumber: number) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set("page", pageNumber.toString());
      return nextParams;
    });
    const container = document.getElementById("products-scroll-area");
    if (container) container.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden bg-background antialiased text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-4 md:py-6">
        <div className="grid lg:grid-cols-[240px_1fr] gap-6 h-full">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block border-r border-border pr-4 overflow-hidden">
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              brands={brands}
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
              minRating={minRating}
              setMinRating={setMinRating}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sort={sort}
              setSort={setSort}
              isFiltered={isFiltered}
              resetFilters={resetFilters}
            />
          </aside>

          {/* Products Content Container */}
          <section className="overflow-hidden flex flex-col h-full">
            <div className="bg-background pb-4 border-b border-border/50 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Catalog
                  </h1>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {isLoading
                      ? "Loading..."
                      : `${filteredProducts.length} curated items`}
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className="lg:hidden p-2 border border-input rounded-xl bg-muted/50 hover:bg-muted transition"
                    aria-label="Open filters"
                  >
                    <SlidersHorizontal className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Products List Container (Pagination removed from inside here) */}
            <div
              id="products-scroll-area"
              className="overflow-y-auto flex-1 pr-1.5 -mr-1.5
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-muted-foreground/10
              [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30"
            >
              {isError && (
                <div className="text-center py-16 bg-destructive/5 rounded-2xl border border-destructive/20 max-w-md mx-auto my-6">
                  <p className="text-destructive font-medium text-xs">
                    Something went wrong fetching the items.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-6">
                {isLoading
                  ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] rounded-xl bg-muted animate-pulse border border-border/30"
                      />
                    ))
                  : paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
              </div>

              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed border-border max-w-sm mx-auto">
                  <h3 className="text-sm font-semibold">No products found</h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    Try adjusting your active configuration filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 shadow transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* FIXED: Pagination sits cleanly outside the scroll region as a layout block footer */}
            <div className="bg-background pt-2 mt-auto">
              <Pagination
                currentPage={currentPage > totalPages ? 1 : currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Drawer Backdrop and Sidebar Panel */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <aside className="relative w-64 bg-background h-full p-4 shadow-xl flex flex-col border-l border-border animate-in slide-in-from-right duration-150">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-sm">Filters</h2>
              <button
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="overflow-y-auto flex-1 pr-1">
              <FilterSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                brands={brands}
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                minRating={minRating}
                setMinRating={setMinRating}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                sort={sort}
                setSort={setSort}
                isFiltered={isFiltered}
                resetFilters={resetFilters}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
