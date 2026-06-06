import type { Product } from "../types/product";
import { mockProducts } from "./mockProducts";

const API_URL = "https://makeup-api.herokuapp.com/api/v1/products.json";

export async function fetchProducts(): Promise<Product[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("API error");
    const data: Product[] = await res.json();
    return data
      .filter((p) => p.image_link && p.name)
      .map((p) => ({ ...p, price: p.price || "9.99" }));
  } catch (e) {
    console.warn("Makeup API unreachable, using mock data", e);
    return mockProducts;
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id) ?? null;
}
