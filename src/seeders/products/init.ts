import { connectDb } from "@/core/db";
import { logger } from "@/core/logger";
import { type ProductModel } from "@/modules/products/model";
import ProductsRepository from "@/modules/products/repository";

const PRODUCTS_SEED_DATA: ProductModel.Create[] = [
  {
    name: "Token",
    sku: "TOKEN_30000",
    basePrice: 49.99,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLyvFWwrZP60SHXerlkn51",
        defaultPriceId: "price_1QMLyvFWwrZP60SHXerlkn51",
      },
      paypal: {
        productId: "PROD-30000",
      },
      xsolla: {
        sku: "TOKEN_30000",
      },
    },
  },
  {
    name: "Token",
    sku: "TOKEN_13500",
    basePrice: 24.99,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLyyFWwrZP60SHbsqvLpKa",
        defaultPriceId: "price_1QMLyyFWwrZP60SHbsqvLpKa",
      },
      paypal: {
        productId: "PROD-13500",
      },
      xsolla: {
        sku: "TOKEN_13500",
      },
    },
  },
  {
    name: "Token",
    sku: "TOKEN_5000",
    basePrice: 9.99,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLz1FWwrZP60SHGT0utRlM",
        defaultPriceId: "price_1QMLz1FWwrZP60SHGT0utRlM",
      },
      paypal: {
        productId: "PROD-5000",
      },
      xsolla: {
        sku: "TOKEN_5000",
      },
    },
  },
  {
    name: "Token",
    sku: "TOKEN_2000",
    basePrice: 4.99,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLz5FWwrZP60SH2DUYUill",
        defaultPriceId: "price_1QMLz5FWwrZP60SH2DUYUill",
      },
      paypal: {
        productId: "PROD-2000",
      },
      xsolla: {
        sku: "TOKEN_2000",
      },
    },
  },
  {
    name: "Token",
    sku: "TOKEN_1000",
    basePrice: 2.99,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLz7FWwrZP60SHIBX8DtZP",
        defaultPriceId: "price_1QMLz7FWwrZP60SHIBX8DtZP",
      },
      paypal: {
        productId: "PROD-1000",
      },
      xsolla: {
        sku: "TOKEN_1000",
      },
    },
  },
  {
    name: "Token",
    sku: "TOKEN_500",
    basePrice: 2.99,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLzAFWwrZP60SHcsfNxnYi",
        defaultPriceId: "price_1QMLzAFWwrZP60SHcsfNxnYi",
      },
    },
  },
];

export async function initProductsSeed() {
  await connectDb();

  const products = await ProductsRepository.createBulk(PRODUCTS_SEED_DATA);

  logger.info(`Seeded: ${products.flatMap((p) => p.sku).join(", ")}.`);
}
