import { initProductsSeed } from "@/seeders/products/init";

export type SeederFn = () => void | Promise<void>;

export const SEEDERS = {
  "products:init": initProductsSeed,
} as const satisfies Record<string, SeederFn>;

export type SeederName = keyof typeof SEEDERS;

export function listSeeders(): SeederName[] {
  return Object.keys(SEEDERS).sort() as SeederName[];
}

export function hasSeeder(name: string): name is SeederName {
  return Object.prototype.hasOwnProperty.call(SEEDERS, name);
}
