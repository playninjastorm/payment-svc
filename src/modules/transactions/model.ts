import { t } from "elysia";

export namespace TransactionModel {
  export enum PaymentMethodEnum {
    XSOLLA = "xsolla",
    PAYPAL = "paypal",
    BINANCEPAY = "binancePay",
    STRIPE = "stripe",
  }

  export enum StatusEnum {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
  }

  export const PurchasedItem = t.Object({
    code: t.String({
      title: "Purchased Item Code",
      minLength: 2,
      maxLength: 500,
    }),
    quantity: t.Number({
      title: "Quantity of the Purchased Item",
      minimum: 1,
      examples: [2],
    }),
    type: t.String({
      title: "Type of the Purchased Item",
    }),
  });

  export const PurchasedDetails = t.Object(
    {
      paypal: t.Optional(
        t.Object(
          {
            orderId: t.Optional(
              t.String({
                title: "Paypal Order ID",
                minLength: 2,
                maxLength: 500,
                examples: ["order_1QMLzA2eZvKYlo2C0q1X3PaX"],
              }),
            ),
            url: t.Optional(
              t.String({
                title: "Paypal URL",
                minLength: 2,
              }),
            ),
          },
          {
            title: "Paypal Purchased Details",
          },
        ),
      ),
      xsolla: t.Optional(
        t.Object(
          {
            orderId: t.Optional(
              t.String({
                title: "Xsolla Order ID",
                minLength: 2,
                maxLength: 500,
                examples: ["order_1QMLzA2eZvKYlo2C0q1X3PaX"],
              }),
            ),
            url: t.Optional(
              t.String({
                title: "Xsolla URL",
                minLength: 2,
              }),
            ),
          },
          {
            title: "Xsolla Purchased Details",
          },
        ),
      ),
      binancePay: t.Optional(
        t.Object(
          {
            merchantTradeNo: t.Optional(
              t.String({
                title: "Binance Pay Merchant Trade No",
                minLength: 2,
                examples: ["trade_1QMLzA2eZvKYlo2C0q1X3PaX"],
              }),
            ),
            prepayId: t.Optional(
              t.String({
                title: "Binance Pay Prepay ID",
                minLength: 2,
                examples: ["prepay_1QMLzA2eZvKYlo2C0q1X3PaX"],
              }),
            ),
            url: t.Optional(
              t.String({
                title: "Binance Pay URL",
                minLength: 2,
              }),
            ),
          },
          {
            title: "Binance Pay Purchased Details",
          },
        ),
      ),
      reseller: t.Optional(
        t.Object(
          {
            id: t.Optional(
              t.String({
                title: "Reseller ID",
                minLength: 2,
              }),
            ),
          },
          {
            title: "Reseller Purchased Details",
          },
        ),
      ),
    },
    {
      title: "Payment Provider Specific Details",
    },
  );
  export type PurchasedDetails = typeof PurchasedDetails.static;

  export const Details = t.Object({
    id: t.String({
      title: "Transaction ID (MongoDB ObjectId as string)",
      examples: ["64a7f0c2b4d1c2e5f6a7b8c9"],
    }),
    method: t.String({
      title: "Payment Method",
      examples: [PaymentMethodEnum.XSOLLA, PaymentMethodEnum.STRIPE],
    }),
    purchasedItems: t.Array(PurchasedItem, {
      title: "List of Purchased Items",
    }),
    amount: t.Number({
      title: "Total Amount of the Transaction",
      minimum: 0,
      examples: [49.99],
    }),
    orderId: t.String({
      title: "Order ID from the Payment Provider",
      minLength: 2,
      maxLength: 500,
      examples: ["order_1QMLzA2eZvKYlo2C0q1X3PaX"],
    }),
    isReseller: t.Boolean({
      title: "Indicates if the Transaction is made by a Reseller",
      default: false,
    }),
    details: t.Optional(PurchasedDetails),
    extraInfo: t.Optional(
      t.Union([t.Object(t.Any()), t.Null()], {
        title: "Extra Information from the Payment Provider",
        default: null,
      }),
    ),
    status: t.Enum(StatusEnum, {
      title: "Transaction Status",
      default: StatusEnum.PENDING,
      examples: [StatusEnum.SUCCESS],
    }),
    charId: t.Optional(
      t.Union(
        [
          t.Number({
            title: "Character ID associated with the Transaction",
            minimum: 1,
            examples: [123456],
          }),
          t.Null(),
        ],
        {
          title: "Character ID or null if not applicable",
          default: null,
        },
      ),
    ),
    promotionId: t.Optional(
      t.String({
        title: "Promotion ID (MongoDB ObjectId as string)",
        examples: ["64a7f0c2b4d1c2e5f6a7b8c9"],
      }),
    ),
    userId: t.String({
      title: "User ID (MongoDB ObjectId as string)",
      examples: ["64a7f0c2b4d1c2e5f6a7b8c9"],
    }),
  });
  export type Details = typeof Details.static;
}
