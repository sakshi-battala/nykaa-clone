import type { Product } from "../types/product";

const fallbackImages: Record<string, string> = {
  lipstick:
    "https://plus.unsplash.com/premium_photo-1677526496932-1b4bddeee554?q=80&w=1084&auto=format&fit=crop",
  foundation:
    "https://images.unsplash.com/photo-1627885793933-584e53987c14?q=80&w=1036&auto=format&fit=crop",
  mascara:
    "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?q=80&w=1674&auto=format&fit=crop",
  eyeliner:
    "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?q=80&w=1674&auto=format&fit=crop",
  blush:
    "https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=1706&auto=format&fit=crop",
  bronzer:
    "https://images.unsplash.com/photo-1500839941678-aae14dbfae9a?q=80&w=2151&auto=format&fit=crop",
  eyeshadow:
    "https://images.unsplash.com/photo-1533562389935-457b1ae48a39?q=80&w=2070&auto=format&fit=crop",
};

export function getProductImage(product: Product): string {
  if (product.image_link?.trim()) {
    return product.image_link;
  }

  return (
    fallbackImages[product.product_type ?? ""] ||
    "https://placehold.co/600x600?text=No+Image"
  );
}
