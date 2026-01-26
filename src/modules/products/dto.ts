import { t } from "elysia";

export namespace ProductDTO {
  export const PlatformStripe = t.Object({
    productId: t.String({
      title: "Stripe Product ID",
      minLength: 2,
      maxLength: 500,
      examples: ["price_1QMLyvFWwrZP60SHXerlkn51"],
    }),
    defaultPriceId: t.String({
      title: "Stripe Default Price ID",
      minLength: 2,
      maxLength: 500,
      examples: ["price_1QMLyyFWwrZP60SHbsqvLpKa"],
    }),
  });
  export type PlatformStripe = typeof PlatformStripe.static;

  export const PlatformPaypal = t.Object({
    productId: t.String({
      title: "PayPal Product ID",
      minLength: 2,
      maxLength: 500,
      examples: ["PROD-30000"],
    }),
  });
  export type PlatformPaypal = typeof PlatformPaypal.static;

  export const PlatformXsolla = t.Object({
    sku: t.String({
      title: "Xsolla SKU",
      minLength: 2,
      maxLength: 500,
      examples: ["TOKEN_30000"],
    }),
  });
  export type PlatformXsolla = typeof PlatformXsolla.static;

  export const Platforms = t.Object({
    stripe: t.Optional(t.Union([PlatformStripe, t.Null()])),
    paypal: t.Optional(t.Union([PlatformPaypal, t.Null()])),
    xsolla: t.Optional(t.Union([PlatformXsolla, t.Null()])),
  });
  export type Platforms = typeof Platforms.static;

  export const Details = t.Object({
    id: t.String({
      title: "Product ID (MongoDB ObjectId as string)",
      examples: ["64a7f0c2b4d1c2e5f6a7b8c9"],
    }),
    name: t.String({
      title: "Product Name",
      minLength: 2,
      maxLength: 100,
      examples: ["Token", "Emblem"],
    }),
    sku: t.String({
      title: "Product SKU",
      minLength: 2,
      maxLength: 255,
      examples: ["TOKEN_30000", "TOKEN_13500"],
    }),
    basePrice: t.Number({
      minimum: 0,
      examples: [49.99, 24.99, 9.99],
    }),
    active: t.Boolean({
      title: "Is Active",
      default: true,
    }),
    platforms: Platforms,
  });
  export type Details = typeof Details.static;

  export const Create = t.Object({
    name: t.String({
      title: "Product Name",
      minLength: 2,
      maxLength: 100,
      examples: ["Token", "Emblem"],
    }),
    sku: t.String({
      title: "Product SKU",
      minLength: 2,
      maxLength: 255,
      examples: ["TOKEN_30000", "TOKEN_13500"],
    }),
    basePrice: t.Number({
      minimum: 0,
      examples: [49.99, 24.99, 9.99],
    }),
    active: t.Boolean({
      title: "Is Active",
      default: true,
    }),
    platforms: Platforms,
  });
  export type Create = typeof Create.static;

  export const ProductList = t.Array(Details);
  export type ProductList = typeof ProductList.static;
}
