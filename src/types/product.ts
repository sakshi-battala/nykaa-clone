export interface Product {
  id: number;
  name: string;
  brand: string | null;
  price: string;
  price_sign: string | null;
  currency: string | null;
  image_link: string;
  description: string | null;
  rating: number | null;
  category: string | null;
  product_type: string | null;
  tag_list: string[];
  product_colors?: { hex_value: string; colour_name: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShade?: {
    colour_name: string;
    hex_value: string;
  } | null;
}
