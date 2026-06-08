import type { Product } from "../types/product";
const API_URL = "https://makeup-api.herokuapp.com/api/v1/products.json";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: Product[] = await res.json();

  return data
    .filter((p) => p.name)
    .map((p) => ({
      ...p,
      price: p.price || "9.99",
    }));
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id) ?? null;
}
