import { t } from "elysia";

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
    // <---
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
}

// {
//   "lines": [
//     {
//       "sku": "TOKENS_30000",
//       "finalPrice": 49.99,
//       "baseSnapshot": 84.99,
//       "discount": {
//         "amountOff": 35.0,
//         "percentOff": 41.18
//       },
//       "platformSync": {
//         "stripe": {
//           "priceId": "price_promo_usd_999"
//         },
//         "paypal": {},
//         "xsolla": {
//           "promotionId": "",
//           "amountOff": 35.0
//         }
//       }
//     }
//   ],
// }
