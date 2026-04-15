import {
  CodeEnum,
  DiscountTypeEnum,
} from "@/commons/models/productPromotion.model";
import { connectDb } from "@/core/db";
import { logger } from "@/core/logger";
import { ProductModel } from "@/modules/products/model";
import ProductRepository from "@/modules/products/repository";

const PRODUCTS_SEED_DATA: ProductModel.Create[] = [
  {
    name: "Emblem",
    sku: CodeEnum.EMBLEM_ELITE,
    quantity: 1,
    active: true,
    defaultDiscountType: DiscountTypeEnum.PERCENT_OFF,
    defaultDiscountValue: 0,
    platforms: {
      stripe: {
        productId: "prod_REnSLtxehaVNAy",
        defaultPriceId: "price_1QMJrfFWwrZP60SHYQSm9xym",
        basePrice: 9.99,
        defaultPrice: 9.99,
      },
      paypal: {
        productId: "PROD-EMBLEM",
        basePrice: 9.99,
        defaultPrice: 9.99,
      },
      xsolla: {
        sku: CodeEnum.EMBLEM_ELITE,
        basePrice: 10.99,
        defaultPrice: 10.99,
      },
    },
  },
  {
    name: "Token",
    sku: CodeEnum.TOKEN_30000,
    quantity: 30000,
    active: true,
    defaultDiscountType: DiscountTypeEnum.PERCENT_OFF,
    defaultDiscountValue: 33,
    platforms: {
      stripe: {
        productId: "prod_REnMHsd9VcHRsv",
        defaultPriceId: "price_1QMJm5FWwrZP60SHmfCAHJOr",
        basePrice: 74.61,
        defaultPrice: 49.99,
      },
      paypal: {
        productId: "PROD-30000",
        basePrice: 74.61,
        defaultPrice: 49.99,
      },
      xsolla: {
        sku: CodeEnum.TOKEN_30000,
        basePrice: 80.58,
        defaultPrice: 53.99,
      },
    },
  },
  {
    name: "Token",
    sku: CodeEnum.TOKEN_13500,
    quantity: 13500,
    active: true,
    defaultDiscountType: DiscountTypeEnum.PERCENT_OFF,
    defaultDiscountValue: 33,
    platforms: {
      stripe: {
        productId: "prod_REnIHi1tQydavb",
        defaultPriceId: "price_1QMJiOFWwrZP60SHjq6N9Zgj",
        basePrice: 37.3,
        defaultPrice: 24.99,
      },
      paypal: {
        productId: "PROD-13500",
        basePrice: 37.3,
        defaultPrice: 24.99,
      },
      xsolla: {
        sku: CodeEnum.TOKEN_13500,
        basePrice: 40.28,
        defaultPrice: 26.99,
      },
    },
  },
  {
    name: "Token",
    sku: CodeEnum.TOKEN_5000,
    quantity: 5000,
    active: true,
    defaultDiscountType: DiscountTypeEnum.PERCENT_OFF,
    defaultDiscountValue: 33,
    platforms: {
      stripe: {
        productId: "prod_REnHYWjMhECR59",
        defaultPriceId: "price_1QMJgmFWwrZP60SH7rCwkyks",
        basePrice: 14.91,
        defaultPrice: 9.99,
      },
      paypal: {
        productId: "PROD-5000",
        basePrice: 14.91,
        defaultPrice: 9.99,
      },
      xsolla: {
        sku: CodeEnum.TOKEN_5000,
        basePrice: 16.4,
        defaultPrice: 10.99,
      },
    },
  },
  {
    name: "Token",
    sku: CodeEnum.TOKEN_2000,
    quantity: 2000,
    active: true,
    defaultDiscountType: DiscountTypeEnum.PERCENT_OFF,
    defaultDiscountValue: 33,
    platforms: {
      stripe: {
        productId: "prod_R34ReF3mnW2aZy",
        defaultPriceId: "price_1QAyIwFWwrZP60SHUovIyWL0",
        basePrice: 7.45,
        defaultPrice: 4.99,
      },
      paypal: {
        productId: "PROD-2000",
        basePrice: 7.45,
        defaultPrice: 4.99,
      },
      xsolla: {
        sku: CodeEnum.TOKEN_2000,
        basePrice: 8.94,
        defaultPrice: 5.99,
      },
    },
  },
  {
    name: "Token",
    sku: CodeEnum.TOKEN_1000,
    quantity: 1000,
    active: true,
    defaultDiscountType: DiscountTypeEnum.PERCENT_OFF,
    defaultDiscountValue: 33,
    platforms: {
      stripe: {
        productId: "prod_REnFdQyl6egcsw",
        defaultPriceId: "price_1QMJerFWwrZP60SHQ0mU0DF0",
        basePrice: 4.46,
        defaultPrice: 2.99,
      },
      paypal: {
        productId: "PROD-1000",
        basePrice: 4.46,
        defaultPrice: 2.99,
      },
      xsolla: null,
    },
  },
  {
    name: "Token",
    sku: CodeEnum.TOKEN_500,
    quantity: 500,
    active: true,
    defaultDiscountType: DiscountTypeEnum.PERCENT_OFF,
    defaultDiscountValue: 33,
    platforms: {
      stripe: {
        productId: "prod_REnB3RY9l39ePm",
        defaultPriceId: "price_1QMJbMFWwrZP60SHQNBwVWDZ",
        basePrice: 2.97,
        defaultPrice: 1.99,
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
