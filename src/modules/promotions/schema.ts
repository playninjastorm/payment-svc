import { Schema, InferSchemaType, model } from "mongoose";

import { DEFAULT_OPTIONS_SCHEMA } from "@/utils/db";
import { PromotionModel } from "@/modules/promotions/model";
import { ProductModel } from "@/modules/products/model";

const promotionScheduleSchema = new Schema(
  {
    startsAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false },
);

const promotionScopeSchema = new Schema(
  {
    mode: {
      type: String,
      enum: PromotionModel.ScopeModeEnum,
      required: true,
      default: PromotionModel.ScopeModeEnum.SKUS,
    },
  },
  { _id: false },
);

const promotionLinesSchema = new Schema(
  {
    sku: {
      type: String,
      enum: ProductModel.CodeEnum,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    baseSnapshot: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      amountOff: {
        type: Number,
        required: true,
        min: 0,
      },
      percentOff: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },
    platformSync: {
      stripe: {
        priceId: {
          type: String,
          default: null,
        },
      },
      paypal: {
        type: String,
        default: null,
      },
      xsolla: {
        promotionId: {
          type: String,
          default: null,
        },
        amountOff: {
          type: Number,
          default: true,
        },
      },
    },
  },
  { _id: false },
);

const promotionSchema = new Schema<PromotionModel.Details>(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 100,
      required: true,
    },
    schedule: promotionScheduleSchema,
    state: {
      type: String,
      enum: PromotionModel.StateEnum,
      required: true,
      default: PromotionModel.StateEnum.SCHEDULED,
    },
    scope: promotionScopeSchema,
    lines: [promotionLinesSchema],
    activatedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  DEFAULT_OPTIONS_SCHEMA,
);

export type Promotion = InferSchemaType<typeof promotionSchema>;
export const PromotionDB = model<Promotion>(
  "Promotions", // Name
  promotionSchema, // Schema
  "paymentPromotions", // Collection name
);
