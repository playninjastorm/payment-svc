import { t } from "elysia";

export namespace ProductDTO {
  export const PlatformStripe = t.Object({
    productId: t.String({
      title: "Stripe Product ID",
      minLength: 2,
      maxLength: 500,
    }),
    defaultPriceId: t.String({
      title: "Stripe Default Price ID",
      minLength: 2,
      maxLength: 500,
    }),
  });
  export type PlatformStripe = typeof PlatformStripe.static;

  export const PlatformPaypal = t.Object({
    productId: t.String({
      title: "PayPal Product ID",
      minLength: 2,
      maxLength: 500,
    }),
  });
  export type PlatformPaypal = typeof PlatformPaypal.static;

  export const PlatformXsolla = t.Object({
    sku: t.String({
      title: "Xsolla SKU",
      minLength: 2,
      maxLength: 500,
    }),
  });
  export type PlatformXsolla = typeof PlatformXsolla.static;

  export const Platforms = t.Object({
    stripe: PlatformStripe.Optional(),
    paypal: PlatformPaypal.Optional(),
    xsolla: PlatformXsolla.Optional(),
  });
  export type Platforms = typeof Platforms.static;

  export const Details = t.Object({
    id: t.String({
      title: "Product ID (MongoDB ObjectId as string)",
    }),
    name: t.String({
      title: "Product Name",
      minLength: 2,
      maxLength: 100,
    }),
    sku: t.String({
      title: "Product SKU",
      minLength: 2,
      maxLength: 255,
    }),
    basePrice: t.Number({
      minimum: 0,
      examples: [49.99, 24.99, 9.99],
    }),
    active: t.Boolean({
      title: "Is Active",
      default: true,
    }),
    platforms: t.Optional(Platforms),
  });
  export type Details = typeof Details.static;

  export const Create = t.Object({
    name: t.String({
      title: "Product Name",
      minLength: 2,
      maxLength: 100,
    }),
    sku: t.String({
      title: "Product SKU",
      minLength: 2,
      maxLength: 255,
    }),
    basePrice: t.Number({
      minimum: 0,
      examples: [49.99, 24.99, 9.99],
    }),
    active: t.Boolean({
      title: "Is Active",
      default: true,
    }),
    platforms: t.Optional(Platforms),
  });
  export type Create = typeof Create.static;
}
