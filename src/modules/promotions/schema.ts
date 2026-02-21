import { Schema, InferSchemaType, model } from "mongoose";

import { DEFAULT_OPTIONS_SCHEMA } from "@/utils/db";
import { PromotionModel } from "@/modules/promotions/model";
import { ProductModel } from "@/modules/products/model";

const promotionScheduleSchema = new Schema<PromotionModel.Schedule>(
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

const promotionScopeSchema = new Schema<PromotionModel.Scope>(
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

const promotionLinesStripeSchema =
  new Schema<PromotionModel.PromotionLineStripe>(
    {
      priceId: {
        type: String,
        required: true,
      },
      baseSnapshot: {
        type: Number,
        required: true,
        min: 0,
      },
      finalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    { _id: false },
  );

const promotionLinesPaypalSchema =
  new Schema<PromotionModel.PromotionLinePaypal>(
    {
      baseSnapshot: {
        type: Number,
        required: true,
        min: 0,
      },
      finalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    { _id: false },
  );

const promotionLinesXsollaSchema =
  new Schema<PromotionModel.PromotionLineXsolla>(
    {
      promotionId: {
        type: String,
        required: true,
      },
      baseSnapshot: {
        type: Number,
        required: true,
        min: 0,
      },
      finalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    { _id: false },
  );

const promotionLinesSchema = new Schema<PromotionModel.PromotionLine>(
  {
    sku: {
      type: String,
      enum: ProductModel.CodeEnum,
      required: true,
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
        type: promotionLinesStripeSchema,
        default: null,
      },
      paypal: {
        type: promotionLinesPaypalSchema,
        default: null,
      },
      xsolla: {
        type: promotionLinesXsollaSchema,
        default: null,
      },
    },
  },
  { _id: false },
);

const promotionAuditSchema = new Schema(
  {
    activatedAt: {
      type: Date,
      required: false,
    },
    endedAt: {
      type: Date,
      required: false,
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
    audit: promotionAuditSchema,
  },
  DEFAULT_OPTIONS_SCHEMA,
);

export type Promotion = InferSchemaType<typeof promotionSchema>;
export const PromotionDB = model<Promotion>(
  "Promotions", // Name
  promotionSchema, // Schema
  "paymentPromotions", // Collection name
);
