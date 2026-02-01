import { t } from "elysia";

export namespace ProductModel {
  export enum CodeEnum {
    TOKEN_30000 = "TOKEN_30000",
    TOKEN_13500 = "TOKEN_13500",
    TOKEN_5000 = "TOKEN_5000",
    TOKEN_2000 = "TOKEN_2000",
    TOKEN_1000 = "TOKEN_1000",
    TOKEN_500 = "TOKEN_500",
  }

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
      examples: [CodeEnum.TOKEN_30000],
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
      examples: [CodeEnum.TOKEN_30000, CodeEnum.TOKEN_13500],
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
    createdAt: t.Union(
      [t.String({ title: "Created At", format: "date-time" }), t.Date()],
      {
        title: "Creation Timestamp",
        default: new Date().toISOString(),
      },
    ),
    updatedAt: t.Union(
      [t.String({ title: "Updated At", format: "date-time" }), t.Date()],
      {
        title: "Update Timestamp",
        default: new Date().toISOString(),
      },
    ),
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
      examples: [CodeEnum.TOKEN_30000, CodeEnum.TOKEN_13500],
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

  export const Store = t.Object({
    sku: t.String({
      title: "Product SKU",
      minLength: 2,
      maxLength: 255,
      examples: [CodeEnum.TOKEN_30000, CodeEnum.TOKEN_13500],
    }),
    display: t.Object({
      base: t.Number({
        title: "Base Price",
        minimum: 0,
        examples: [84.99, 49.99],
      }),
      final: t.Number({
        title: "Final Price",
        minimum: 0,
        examples: [49.99, 29.99],
      }),
      amountOff: t.Number({
        title: "Amount Off",
        examples: [35.0, 20.0],
      }),
      percentOff: t.Number({
        title: "Percent Off",
        maximum: 100,
        examples: [41.18, 40.0],
      }),
      label: t.String({
        title: "Discount Label",
        minLength: 2,
        maxLength: 50,
        examples: ["40% OFF", "20% OFF"],
      }),
    }),
  });
  export type Store = typeof Store.static;
}
