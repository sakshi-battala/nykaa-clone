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
  lip_liner:
    "https://static.beautytocare.com/cdn-cgi/image/width=1600,height=1600,f=auto/media/catalog/product//n/y/nyx-pro-makeup-suede-matte-lip-liner-soft-spoken-1g_1.jpg",
  eyebrow:
    "https://alixavien.in/cdn/shop/products/Brow-Liner-154-Deepest-Brown-iz.jpg?v=1681711712&width=1445",
  nail_polish:
    "https://keautybeauty.in/cdn/shop/files/2_1.jpg?v=1741252363&width=4000",
};

export function getProductImage(product: Product): string {
  return (
    product.image_link ||
    fallbackImages[product.product_type ?? ""] ||
    "https://placehold.co/600x600?text=No+Image"
  );
}

export function getFallbackImage(product: Product): string {
  return (
    fallbackImages[product.product_type ?? ""] ||
    "https://placehold.co/600x600?text=No+Image"
  );
}
