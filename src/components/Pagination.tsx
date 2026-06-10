import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Don't render anything if there is only 1 page or none
  if (totalPages <= 1) return null;

  // Helper logic to generate structured page numbers with ellipses [...]
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Adjust to show more or fewer explicit numbers

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4 mt-auto border-t border-border/40 text-xs">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="size-8 rounded-lg border border-border/60 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-background disabled:hover:text-muted-foreground transition cursor-pointer disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {/* Page Numbers Grid */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="size-8 flex items-center justify-center text-muted-foreground font-medium select-none"
              >
                &hellip;
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              aria-current={isCurrent ? "page" : undefined}
              className={`size-8 rounded-lg font-medium transition cursor-pointer flex items-center justify-center ${
                isCurrent
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "border border-border/40 bg-background text-foreground/80 hover:bg-muted hover:text-foreground"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="size-8 rounded-lg border border-border/60 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-background disabled:hover:text-muted-foreground transition cursor-pointer disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
