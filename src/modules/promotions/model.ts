import { t } from "elysia";

import {
  CodeEnum,
  DiscountTypeEnum,
} from "@/commons/models/productPromotion.model";

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
    startsAt: t.Union([
      t.String({
        title: "Promotion Start DateTime (ISO 8601 string)",
        format: "date-time",
        examples: ["2026-07-01T00:00:00Z"],
      }),
      t.Date(),
    ]),
    endsAt: t.Union([
      t.String({
        title: "Promotion End DateTime (ISO 8601 string)",
        examples: ["2026-07-15T23:59:59Z"],
        format: "date-time",
      }),
      t.Date(),
    ]),
  });
  export type Schedule = typeof Schedule.static;

  export const Scope = t.Object({
    mode: t.Enum(ScopeModeEnum, {
      title: "Promotion Scope Mode",
      examples: [ScopeModeEnum.SKUS],
    }),
  });
  export type Scope = typeof Scope.static;

  export const PromotionLineStripe = t.Object({
    couponId: t.String({
      title: "Stripe Promotion Coupon ID",
      minLength: 2,
      maxLength: 500,
      examples: ["Z7cOkP7l"],
    }),
    baseSnapshot: t.Number({
      title: "Base Price Snapshot Before Discount",
      minimum: 0,
      examples: [49.99],
    }),
    finalPrice: t.Number({
      title: "Final Price After Discount",
      minimum: 0,
      examples: [30.99],
    }),
    redeemedHistory: t.Array(
      t.Object({
        couponId: t.Union([
          t.String({
            title: "Stripe Promotion Coupon ID",
            examples: ["Z7cOkP7l"],
          }),
          t.Date(),
        ]),
        timesRedeemed: t.Number({
          title: "Times Redeemed",
          minimum: 0,
          default: 0,
          examples: [0],
        }),
      }),
    ),
  });
  export type PromotionLineStripe = typeof PromotionLineStripe.static;

  export const PromotionLinePaypal = t.Object({
    baseSnapshot: t.Number({
      title: "Base Price Snapshot Before Discount",
      minimum: 0,
      examples: [49.99],
    }),
    finalPrice: t.Number({
      title: "Final Price After Discount",
      minimum: 0,
      examples: [30.99],
    }),
  });
  export type PromotionLinePaypal = typeof PromotionLinePaypal.static;

  export const PromotionLineXsolla = t.Object({
    promotionId: t.String({
      title: "Xsolla Promotion ID",
      minLength: 2,
      maxLength: 500,
      examples: ["price_1QMLzA2eZvKYlo2C0q1X3PaX"],
    }),
    baseSnapshot: t.Number({
      title: "Base Price Snapshot Before Discount",
      minimum: 0,
      examples: [49.99],
    }),
    finalPrice: t.Number({
      title: "Final Price After Discount",
      minimum: 0,
      examples: [30.99],
    }),
  });
  export type PromotionLineXsolla = typeof PromotionLineXsolla.static;

  export const PromotionLine = t.Object({
    sku: t.Enum(CodeEnum, {
      title: "Product SKU",
      examples: [CodeEnum.TOKEN_30000],
    }),
    discount: t.Object({
      discountType: t.Enum(DiscountTypeEnum, {
        title: "Discount Type",
        examples: [DiscountTypeEnum.PERCENT_OFF, DiscountTypeEnum.AMOUNT_OFF],
      }),
      discountValue: t.Number({
        title: "Discount Value",
        minimum: 0,
        examples: [41.18],
      }),
    }),
    platformSync: t.Object({
      stripe: t.Optional(
        t.Union([PromotionModel.PromotionLineStripe, t.Null()], {
          title: "Stripe Promotion Price Info",
          default: null,
          examples: [
            {
              couponId: "Z7cOkP7l",
              baseSnapshot: 49.99,
              finalPrice: 30.99,
              redeemedHistory: [
                {
                  couponId: "Z7cOkP7l",
                  timesRedeemed: 0,
                },
              ],
            },
          ],
        }),
      ),
      paypal: t.Optional(
        t.Union([PromotionModel.PromotionLinePaypal, t.Null()], {
          title: "Paypal Promotion Price Info",
          default: null,
          examples: [
            {
              baseSnapshot: 49.99,
              finalPrice: 30.99,
            },
          ],
        }),
      ),
      xsolla: t.Optional(
        t.Union([PromotionModel.PromotionLineXsolla, t.Null()], {
          title: "Xsolla Promotion Price Info",
          default: null,
          examples: [
            {
              promotionId: "price_1QMLzA2eZvKYlo2C0q1X3PaX",
              baseSnapshot: 59.99,
              finalPrice: 35.99,
            },
          ],
        }),
      ),
    }),
  });
  export type PromotionLine = typeof PromotionLine.static;

  export const PromotionAudit = t.Object({
    activatedAt: t.Optional(
      t.Union([
        t.String({
          title: "Promotion Activated DateTime (ISO 8601 string)",
          format: "date-time",
          examples: ["2026-07-01T00:00:00Z"],
        }),
        t.Date(),
        t.Null(),
      ]),
    ),
    endedAt: t.Optional(
      t.Union([
        t.String({
          title: "Promotion Ended DateTime (ISO 8601 string)",
          examples: ["2026-07-15T23:59:59Z"],
          format: "date-time",
        }),
        t.Date(),
        t.Null(),
      ]),
    ),
  });
  export type PromotionAudit = typeof PromotionAudit.static;

  export const Details = t.Object(
    {
      id: t.String({
        title: "Promotion ID (MongoDB ObjectId as string)",
        examples: ["64a7f0c2b4d1c2e5f6a7b8c9"],
      }),
      name: t.String({
        title: "Promotion Name",
        minLength: 2,
        maxLength: 100,
        examples: ["Anniversary 2026", "Valentine's Day 2024"],
      }),
      schedule: Schedule,
      state: t.Enum(StateEnum, {
        title: "Promotion State",
        examples: [StateEnum.SCHEDULED, StateEnum.ACTIVE],
      }),
      scope: Scope,
      lines: t.Array(PromotionLine, {
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
      audit: t.Optional(PromotionAudit),
    },
    {
      title: "Promotion Details",
    },
  );
  export type Details = typeof Details.static;

  export const CreateRequest = t.Object(
    {
      name: t.String({
        title: "Promotion Name",
        minLength: 2,
        maxLength: 100,
        examples: ["Anniversary 2026", "Valentine's Day 2024"],
      }),
      schedule: Schedule,
      scope: Scope,
      lines: t.Array(
        t.Object({
          sku: t.Enum(CodeEnum, {
            title: "Product SKU",
            examples: [CodeEnum.TOKEN_30000],
          }),
          discount: t.Object({
            discountType: t.Enum(DiscountTypeEnum, {
              title: "Discount Type",
              examples: [
                DiscountTypeEnum.PERCENT_OFF,
                DiscountTypeEnum.AMOUNT_OFF,
              ],
            }),
            discountValue: t.Number({
              title: "Discount Value",
              minimum: 0,
              examples: [41.18],
            }),
          }),
          platformSync: t.Object({
            stripe: t.Optional(
              t.Boolean({
                title: "Apply promotion on Stripe",
              }),
            ),
            paypal: t.Optional(
              t.Boolean({
                title: "Apply promotion on PayPal",
              }),
            ),
            xsolla: t.Optional(
              t.Union(
                [
                  t.Object({
                    promotionId: t.String({
                      title: "Xsolla Promotion ID",
                      minLength: 2,
                      maxLength: 500,
                      examples: ["price_1QMLzA2eZvKYlo2C0q1X3PaX"],
                    }),
                  }),
                  t.Null(),
                ],
                {
                  title: "Xsolla Promotion Price Info",
                  default: null,
                  examples: [
                    {
                      promotionId: "price_1QMLzA2eZvKYlo2C0q1X3PaX",
                    },
                  ],
                },
              ),
            ),
          }),
        }),
        {
          title: "Promotion Product Lines",
        },
      ),
    },
    {
      title: "Promotion Creation Payload",
    },
  );
  export type CreateRequest = typeof CreateRequest.static;

  export const Create = t.Omit(Details, [
    "id",
    "audit",
    "createdAt",
    "updatedAt",
  ]);
  export type Create = typeof Create.static;
}
