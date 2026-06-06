export const productTypeMap: Record<string, string> = {
  lipstick: "Lipsticks",
  foundation: "Foundations",
  bronzer: "Bronzers",
  blush: "Blushes",
  mascara: "Mascaras",
  eyeliner: "Eyeliners",
  eyebrow: "Eyebrow Products",
  concealer: "Concealers",
  nail_polish: "Nail Polish",
  lip_liner: "Lip Liners",
  eyeshadow: "Eyeshadows",
};

export function labelForType(type: string | null | undefined): string {
  if (!type) return "Beauty";
  return (
    productTypeMap[type] ??
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
