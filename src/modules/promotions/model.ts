import { t } from "elysia";

import { ProductModel } from "@/modules/products/model";

export namespace PromotionModel {
  export enum ScopeModeEnum {
    SKUS = "SKUS",
  }
  export enum StateEnum {
    SCHEDULED = "SCHEDULED",
    ACTIVATING = "ACTIVATING",
    ACTIVE = "ACTIVE",
    ENDING = "ENDING",
    ENDED = "ENDED",
  }

  export const Schedule = t.Object({
    startsAt: t.String({
      title: "Promotion Start DateTime (ISO 8601 string)",
      examples: ["2024-07-01T00:00:00Z"],
    }),
    endsAt: t.String({
      title: "Promotion End DateTime (ISO 8601 string)",
      examples: ["2024-07-15T23:59:59Z"],
    }),
  });
  export type Schedule = typeof Schedule.static;

  export const Scope = t.Object({
    mode: t.Enum(ScopeModeEnum, {
      title: "Promotion Scope Mode",
      examples: [ScopeModeEnum.SKUS],
    }),
  });
  export type Scope = typeof Scope.static;

  export const ProductLine = t.Object({
    sku: t.String({
      title: "Product SKU",
      examples: [ProductModel.CodeEnum.TOKEN_30000],
    }),
    finalPrice: t.Number({
      title: "Final Price After Discount",
      minimum: 0,
      examples: [49.99],
    }),
    baseSnapshot: t.Number({
      title: "Base Price Snapshot Before Discount",
      minimum: 0,
      examples: [84.99],
    }),
    discount: t.Object({
      amountOff: t.Number({
        title: "Amount Off",
        minimum: 0,
        examples: [35.0],
      }),
      percentOff: t.Number({
        title: "Percent Off",
        minimum: 0,
        maximum: 100,
        examples: [41.18],
      }),
    }),
    platformSync: t.Object({
      stripe: t.Optional(
        t.Union([
          t.Object({
            priceId: t.String({
              title: "Stripe Promotion Price ID",
              minLength: 2,
              maxLength: 500,
              examples: ["price_promo_usd_999"],
            }),
          }),
          t.Null(),
        ]),
      ),
      paypal: t.Optional(t.Union([t.Object({}), t.Null()])),
      xsolla: t.Optional(
        t.Union([
          t.Object({
            promotionId: t.String({
              title: "Xsolla Promotion ID",
              minLength: 2,
              maxLength: 500,
              examples: [""],
            }),
            amountOff: t.Number({
              title: "Amount Off for Xsolla",
              minimum: 0,
              examples: [35.0],
            }),
          }),
          t.Null(),
        ]),
      ),
    }),
  });
  export type ProductLine = typeof ProductLine.static;

  export const Details = t.Object({
    id: t.String({
      title: "Promotion ID (MongoDB ObjectId as string)",
      examples: ["64a7f0c2b4d1c2e5f6a7b8c9"],
    }),
    name: t.String({
      title: "Promotion Name",
      minLength: 2,
      maxLength: 100,
      examples: ["Anniversary 2025", "Valentine's Day 2024"],
    }),
    schedule: Schedule,
    state: t.Enum(StateEnum, {
      title: "Promotion State",
      examples: [StateEnum.SCHEDULED, StateEnum.ACTIVE],
    }),
    scope: Scope,
    lines: t.Array(ProductLine, {
      title: "Promotion Product Lines",
    }),
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
    activatedAt: t.Optional(
      t.Union(
        [
          t.String({ title: "Updated At", format: "date-time" }),
          t.Date(),
          t.Null(),
        ],
        {
          title: "Update Timestamp",
          default: new Date().toISOString(),
        },
      ),
    ),
    endedAt: t.Optional(
      t.Union(
        [
          t.String({ title: "Updated At", format: "date-time" }),
          t.Date(),
          t.Null(),
        ],
        {
          title: "Update Timestamp",
          default: new Date().toISOString(),
        },
      ),
    ),
  });
  export type Details = typeof Details.static;

  export const Create = t.Object({
    name: t.String({
      title: "Promotion Name",
      minLength: 2,
      maxLength: 100,
      examples: ["Anniversary 2025", "Valentine's Day 2024"],
    }),
    schedule: Schedule,
    scope: Scope,
    lines: t.Array(ProductLine, {
      title: "Promotion Product Lines",
    }),
  });
  export type Create = typeof Create.static;
}
