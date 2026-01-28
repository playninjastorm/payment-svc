import { Schema, InferSchemaType, model } from "mongoose";

import { DEFAULT_OPTIONS_SCHEMA } from "@/utils/db.utils";
import { ProductDTO } from "@/modules/products/dto";

const productPlatormStripeSchema = new Schema(
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

const productPlatformPaypalSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const productPlatformXsollaSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const productPlatformsSchema = new Schema(
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

const productSchema = new Schema<ProductDTO.Details>(
  {
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
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

export type Product = InferSchemaType<typeof productSchema>;
export const ProductModel = model<Product>(
  "Products", // Name
  productSchema, // Schema
  "paymentProducts", // Collection name
);
