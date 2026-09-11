import drinkware from "@/assets/cat-drinkware.jpg";
import tech from "@/assets/cat-tech.jpg";
import desk from "@/assets/cat-desk.jpg";
import apparel from "@/assets/cat-apparel.jpg";
import eco from "@/assets/cat-eco.jpg";
import hampers from "@/assets/cat-hampers.jpg";
import awards from "@/assets/cat-awards.jpg";
import travel from "@/assets/cat-travel.jpg";

export const SITE = {
  name: "Druvians",
  tagline: "Corporate Gifts That Inspire",
  url: "https://druvians.com",
  phone: "+91 9152307515",
  phoneHref: "tel:+919152307515",
  whatsapp: "https://wa.me/919152307515",
  email: "hello@druvians.com",
  address: "Mumbai, Maharashtra, India",
  hours: "Monday to Saturday, 10:00 - 19:00 IST",
};

export const CATEGORY_IMAGES: Record<string, string> = {
  drinkware,
  "tech-gadgets": tech,
  "desk-stationery": desk,
  apparel,
  "eco-friendly": eco,
  hampers,
  "awards-trophies": awards,
  "travel-bags": travel,
};

export const FALLBACK_IMAGE = hampers;

export function categoryImage(slug?: string | null) {
  if (slug && CATEGORY_IMAGES[slug]) return CATEGORY_IMAGES[slug];
  return FALLBACK_IMAGE;
}

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "On request";
  return `From ₹${Number(value).toLocaleString("en-IN")}`;
}
