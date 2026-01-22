import { initProductsSeed } from "@/seeders/init-products-seed";

export const SEEDERS = {
  init_products: initProductsSeed,
} as const;

export type SeederName = keyof typeof SEEDERS;
