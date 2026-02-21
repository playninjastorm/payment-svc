import { connectDb } from "@/core/db";
import { logger } from "@/core/logger";
import { ProductModel } from "@/modules/products/model";
import ProductRepository from "@/modules/products/repository";

const PRODUCTS_SEED_DATA: ProductModel.Create[] = [
  {
    name: "Emblem",
    sku: ProductModel.CodeEnum.EMBLEM_ELITE,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLxzFWwrZP60SHpXSznUl1",
        defaultPriceId: "price_1QMLxzFWwrZP60SHpXSznUl1",
        basePrice: 9.99,
      },
      paypal: {
        productId: "PROD-EMBLEM",
        basePrice: 9.99,
      },
      xsolla: {
        sku: ProductModel.CodeEnum.EMBLEM_ELITE,
        basePrice: 10.99,
      },
    },
  },
  {
    name: "Token",
    sku: ProductModel.CodeEnum.TOKEN_30000,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLyvFWwrZP60SHXerlkn51",
        defaultPriceId: "price_1QMLyvFWwrZP60SHXerlkn51",
        basePrice: 49.99,
      },
      paypal: {
        productId: "PROD-30000",
        basePrice: 49.99,
      },
      xsolla: {
        sku: ProductModel.CodeEnum.TOKEN_30000,
        basePrice: 53.99,
      },
    },
  },
  {
    name: "Token",
    sku: ProductModel.CodeEnum.TOKEN_13500,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLyyFWwrZP60SHbsqvLpKa",
        defaultPriceId: "price_1QMLyyFWwrZP60SHbsqvLpKa",
        basePrice: 24.99,
      },
      paypal: {
        productId: "PROD-13500",
        basePrice: 24.99,
      },
      xsolla: {
        sku: ProductModel.CodeEnum.TOKEN_13500,
        basePrice: 26.99,
      },
    },
  },
  {
    name: "Token",
    sku: ProductModel.CodeEnum.TOKEN_5000,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLz1FWwrZP60SHGT0utRlM",
        defaultPriceId: "price_1QMLz1FWwrZP60SHGT0utRlM",
        basePrice: 9.99,
      },
      paypal: {
        productId: "PROD-5000",
        basePrice: 9.99,
      },
      xsolla: {
        sku: ProductModel.CodeEnum.TOKEN_5000,
        basePrice: 10.99,
      },
    },
  },
  {
    name: "Token",
    sku: ProductModel.CodeEnum.TOKEN_2000,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLz5FWwrZP60SH2DUYUill",
        defaultPriceId: "price_1QMLz5FWwrZP60SH2DUYUill",
        basePrice: 4.99,
      },
      paypal: {
        productId: "PROD-2000",
        basePrice: 4.99,
      },
      xsolla: {
        sku: ProductModel.CodeEnum.TOKEN_2000,
        basePrice: 5.99,
      },
    },
  },
  {
    name: "Token",
    sku: ProductModel.CodeEnum.TOKEN_1000,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLz7FWwrZP60SHIBX8DtZP",
        defaultPriceId: "price_1QMLz7FWwrZP60SHIBX8DtZP",
        basePrice: 2.99,
      },
      paypal: {
        productId: "PROD-1000",
        basePrice: 2.99,
      },
      xsolla: null,
    },
  },
  {
    name: "Token",
    sku: ProductModel.CodeEnum.TOKEN_500,
    active: true,
    platforms: {
      stripe: {
        productId: "price_1QMLzAFWwrZP60SHcsfNxnYi",
        defaultPriceId: "price_1QMLzAFWwrZP60SHcsfNxnYi",
        basePrice: 1.99,
      },
      paypal: null,
      xsolla: null,
    },
  },
];

export async function initProductsSeed() {
  await connectDb();

  const products = await ProductRepository.createBulk(PRODUCTS_SEED_DATA);

  logger.info(`Seeded: ${products.flatMap((p) => p.sku).join(", ")}.`);
}
