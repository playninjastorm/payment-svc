import { Schema, InferSchemaType, model, Types } from "mongoose";

import { DEFAULT_OPTIONS_SCHEMA } from "@/utils/db";
import { TransactionModel } from "@/modules/transactions/model";

const PurchasedItemSchema = new Schema(
  {
    code: { type: String, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { _id: false },
);

const PurchasedDetailsSchema = new Schema(
  {
    paypal: {
      orderId: String,
      url: String,
    },
    xsolla: {
      orderId: String,
      url: String,
    },
    binancePay: {
      merchantTradeNo: String,
      prepayId: String,
      url: String,
    },
    reseller: {
      id: String,
    },
  },
  { _id: false, default: {} },
);

const transactionSchema = new Schema<TransactionModel.Details>(
  {
    method: { type: String, required: true },
    purchasedItems: [PurchasedItemSchema],
    amount: { type: Number, required: true },
    orderId: { type: String, required: true },
    isReseller: { type: Boolean, default: false },
    details: {
      type: PurchasedDetailsSchema,
      required: false,
    },
    extraInfo: { type: Object, required: false, default: {} },
    status: {
      type: String,
      enum: TransactionModel.StatusEnum,
      required: true,
      default: TransactionModel.StatusEnum.PENDING,
    },
    charId: { type: Number },
    promotionId: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  DEFAULT_OPTIONS_SCHEMA,
);

export type Transaction = InferSchemaType<typeof transactionSchema>;
export const TransactionDB = model<Transaction>(
  "Payment", // Name
  transactionSchema, // Schema
  "payment", // Collection name
);
