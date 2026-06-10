import { RotateCcw } from "lucide-react";

export interface FilterSidebarProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  brands: string[];
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  sort: string;
  setSort: (sort: string) => void;
  isFiltered: boolean;
  resetFilters: () => void;
}

export function FilterSidebar({
  categories,
  selectedCategories,
  toggleCategory,
  brands,
  selectedBrands,
  toggleBrand,
  minRating,
  setMinRating,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  isFiltered,
  resetFilters,
}: FilterSidebarProps) {
  return (
    <div className="h-full flex flex-col gap-5 text-xs">
      <div className="flex items-center justify-between min-h-[24px]">
        <h2 className="text-sm font-semibold tracking-tight hidden lg:block text-foreground/90">
          Filters
        </h2>
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="cursor-pointer text-[11px] font-medium text-destructive flex items-center gap-1 hover:bg-destructive/10 px-2 py-0.5 rounded-md transition-colors"
          >
            <RotateCcw className="size-3" /> Clear All
          </button>
        )}
      </div>

      {/* Main Sidebar Section Custom Rounded Scrollbar view */}
      <div
        className="space-y-5 overflow-y-auto flex-1 pr-1.5
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40"
      >
        {/* Sort Select */}
        <div>
          <h3 className="font-semibold mb-1.5 text-muted-foreground/80 tracking-wide uppercase text-[10px]">
            Sort By
          </h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border border-input rounded-lg bg-background px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-primary/10 text-xs cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
          </select>
        </div>

        {/* Categories Nested Lists with custom micro scrolls */}
        <div>
          <h3 className="font-semibold mb-1.5 text-muted-foreground/80 tracking-wide uppercase text-[10px]">
            Categories
          </h3>
          <div
            className="space-y-1 max-h-32 overflow-y-auto pr-1
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-muted-foreground/10
            [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors py-0.5"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="rounded border-input text-primary focus:ring-primary/10 size-3.5 accent-primary"
                />
                <span className="capitalize text-foreground/80 text-xs truncate">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands Nested Lists with custom micro scrolls */}
        <div>
          <h3 className="font-semibold mb-1.5 text-muted-foreground/80 tracking-wide uppercase text-[10px]">
            Brands
          </h3>
          <div
            className="space-y-1 max-h-32 overflow-y-auto pr-1
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-muted-foreground/10
            [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors py-0.5"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded border-input text-primary focus:ring-primary/10 size-3.5 accent-primary"
                />
                <span className="text-foreground/80 text-xs truncate">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <h3 className="font-semibold mb-1.5 text-muted-foreground/80 tracking-wide uppercase text-[10px]">
            Minimum Rating
          </h3>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full border border-input rounded-lg bg-background px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-primary/10 text-xs cursor-pointer"
          >
            <option value={0}>All Ratings</option>
            <option value={3}>3★ & Up</option>
            <option value={4}>4★ & Up</option>
            <option value={4.5}>4.5★ & Up</option>
          </select>
        </div>

        {/* Max Price Range Input Filter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-muted-foreground/80 tracking-wide uppercase text-[10px]">
              Maximum Price
            </h3>
            <span className="font-bold text-primary px-1.5 py-0.5 bg-primary/5 rounded text-[10px]">
              ${maxPrice}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1 bg-muted rounded-md appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
    </div>
  );
}
