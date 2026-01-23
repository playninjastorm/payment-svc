import { Schema } from "mongoose";

import { DEFAULT_OPTIONS_SCHEMA } from "@/utils/db.utils";

export const productPlatormStripeSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    defaultPriceId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { _id: false },
);

export const productPlatformPaypalSchema = new Schema(
  {
    product_id: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { _id: false },
);

export const productPlatformXsollaSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { _id: false },
);

export const productPlatformsSchema = new Schema(
  {
    stripe: {
      type: productPlatormStripeSchema,
      required: false,
    },
    paypal: {
      type: productPlatformPaypalSchema,
      required: false,
    },
    xsolla: {
      type: productPlatformXsollaSchema,
      required: false,
    },
  },
  { _id: false },
);

export const productSchema = new Schema(
  {
    id: {
      type: Schema.ObjectId,
      required: true,
      unique: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    platforms: {
      type: productPlatformsSchema,
      required: true,
    },
  },
  DEFAULT_OPTIONS_SCHEMA,
);
