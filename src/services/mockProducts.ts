import type { Product } from "../types/product";

const brands = [
  "maybelline",
  "covergirl",
  "l'oreal",
  "nyx",
  "revlon",
  "mac",
  "clinique",
  "dior",
];
const types = [
  "lipstick",
  "foundation",
  "mascara",
  "eyeliner",
  "blush",
  "bronzer",
  "eyeshadow",
];
const names: Record<string, string[]> = {
  lipstick: [
    "Velvet Matte Lipstick",
    "Hydra Glow Lip",
    "Color Sensational",
    "Rouge Pur Couture",
    "Lip Lacquer",
  ],
  foundation: [
    "Fit Me Foundation",
    "True Match",
    "Studio Fix Fluid",
    "Pro Filt'r",
    "Airbrush Flawless",
  ],
  mascara: [
    "Lash Sensational",
    "Volum' Express",
    "They're Real!",
    "Better Than Sex",
    "Sky High",
  ],
  eyeliner: [
    "Master Precise Liner",
    "Epic Ink Liner",
    "Tattoo Liner",
    "Liquid Eyeliner",
    "Kohl Pencil",
  ],
  blush: [
    "Cheek Heat Blush",
    "Powder Blush",
    "Cream Blush",
    "Mineralize Blush",
    "Pop Blush",
  ],
  bronzer: [
    "Sun Kissed Bronzer",
    "Bronze Goddess",
    "Hoola Bronzer",
    "Glow Bronzer",
    "Matte Bronzer",
  ],
  eyeshadow: [
    "Naked Palette",
    "Soft Glam",
    "Nude Palette",
    "Smoky Quartz",
    "Rose Gold Palette",
  ],
};
const colors = [
  { hex_value: "#c2185b", colour_name: "Rose" },
  { hex_value: "#8d4925", colour_name: "Nude" },
  { hex_value: "#7b1f3a", colour_name: "Berry" },
  { hex_value: "#e91e63", colour_name: "Pink" },
  { hex_value: "#5d2a3a", colour_name: "Plum" },
];

function img(type: string, i: number) {
  // Use Unsplash beauty product images
  const seed = `${type}-${i}`;
  return `https://picsum.photos/seed/${seed}/600/600`;
}

export const mockProducts: Product[] = Array.from({ length: 60 }, (_, i) => {
  const type = types[i % types.length];
  const brand = brands[i % brands.length];
  const nameOpts = names[type];
  const name = `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${nameOpts[i % nameOpts.length]}`;
  return {
    id: i + 1,
    name,
    brand,
    price: (Math.floor(Math.random() * 40) + 8).toFixed(2),
    price_sign: "$",
    currency: "USD",
    image_link: img(type, i),
    description: `Discover the ${name}. A luxurious ${type} crafted with premium ingredients for a flawless finish that lasts all day. Cruelty-free and dermatologist-tested.`,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    category: type,
    product_type: type,
    tag_list: ["vegan", "cruelty-free", i % 2 ? "best-seller" : "new"],
    product_colors: colors.slice(0, 3 + (i % 3)),
  };
});
