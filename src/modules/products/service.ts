import { DiscountTypeEnum } from "@/commons/models/productPromotion.model";
import { stripe } from "@/core/stripe";
import { ProductModel } from "@/modules/products/model";
import ProductRepository from "@/modules/products/repository";
import { PromotionRepository } from "@/modules/promotions/repository";

export abstract class ProductService {
  static async list() {
    const items = await ProductRepository.list();

    const products = await stripe.products.list({
      active: true,
      limit: 100,
    });

    const product = products.data[0];

    console.log(">>>>>>>>>>>>>> Product:");
    console.log(JSON.stringify(product, null, 2));

    // >>>>>>>>>>>>>>>>>>> CUPONES

    // const coupon = await stripe.coupons.create({
    //   amount_off: 2,
    //   name: "Test Coupon",
    //   currency: "usd",
    // });

    // console.log(">>>>>>>>>>>>>> New coupon:");
    // console.log(JSON.stringify(coupon, null, 2));

    const coupons = await stripe.coupons.list({
      limit: 100,
    });

    console.log(">>>>>>>>>>>>>> Coupons:");
    console.log(JSON.stringify(coupons, null, 2));

    // const coupon = await stripe.coupons.retrieve(coupons.data[0].id);

    // console.log(">>>>>>>>>>>>>> Coupon Details:");
    // console.log(JSON.stringify(coupon, null, 2));

    // const del = await stripe.coupons.del(coupons.data[0].id);

    // console.log(">>>>>>>>>>>>>> Deleted coupon:");
    // console.log(JSON.stringify(del, null, 2));

    // >>>>>>>>>>>>>>>>>>> Promociones

    // const promo = await stripe.promotionCodes.create({
    //   promotion: {
    //     coupon: coupons.data[0].id,
    //     type: "coupon",
    //   },
    //   code: "TESTCODE",
    //   active: true,
    //   //  expires_at:
    // });

    // console.log(">>>>>>>>>>>>>> Promotion:");
    // console.log(JSON.stringify(promo, null, 2));

    // const promoList = await stripe.promotionCodes.list({
    //   limit: 100,
    // });

    // console.log(">>>>>>>>>>>>>> Promotion List:");
    // console.log(JSON.stringify(promoList, null, 2));

    // const checkout = await stripe.checkout.sessions.create({
    //   discounts: [
    //     {
    //       coupon: coupons.data[0].id,
    //     },
    //   ],
    //   line_items: [
    //     {
    //       price: product.default_price as string,
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "payment",
    //   success_url: "https://example.com/success",
    //   cancel_url: "https://example.com/cancel",
    //   metadata: {
    //     orderId: "order-1234",
    //   },
    //   custom_text: {
    //     after_submit: {
    //       message: "Thank you for your purchase!!!",
    //     },
    //   },
    //   client_reference_id: "user-1234",
    // });

    // console.log(">>>>>>>>>>>>>> Checkout session:");
    // console.log(JSON.stringify(checkout, null, 2));

    return items;
  }

  static async storeList() {
    const items = await ProductRepository.list();

    const products = await PromotionRepository.listActiveProducts();

    const storeItems: ProductModel.Store[] = [];

    const DISCOUNT_DEFAULT = {
      discountType: DiscountTypeEnum.PERCENT_OFF,
      discountValue: 33,
    };
    const DEFAULT_OFFER_LABEL = `${DISCOUNT_DEFAULT.discountValue}% off`;

    for (const item of items) {
      const promotion = products.find((p) => p.sku === item.sku);

      const discount = promotion ? promotion.discount : DISCOUNT_DEFAULT;

      let offerLabel = DEFAULT_OFFER_LABEL;

      if (promotion) {
        if (promotion.discount.discountType === DiscountTypeEnum.PERCENT_OFF) {
          offerLabel = `${promotion.discount.discountValue}% off`;
        } else if (
          promotion.discount.discountType === DiscountTypeEnum.AMOUNT_OFF
        ) {
          offerLabel = `$${promotion.discount.discountValue} off`;
        } else {
          offerLabel = "";
        }
      }

      storeItems.push({
        sku: item.sku,
        display: {
          ...discount,
          label: offerLabel,
          prices: {
            stripe:
              promotion?.platformSync.stripe?.finalPrice ??
              item.platforms.stripe?.basePrice ??
              null,
            paypal:
              promotion?.platformSync.paypal?.finalPrice ??
              item.platforms.paypal?.basePrice ??
              null,
            xsolla:
              promotion?.platformSync.xsolla?.finalPrice ??
              item.platforms.xsolla?.basePrice ??
              null,
          },
        },
      });
    }

    return storeItems;
  }

  static async createBulk(products: ProductModel.Create[]) {
    const items = await ProductRepository.createBulk(products);

    return items;
  }
}

export default ProductService;
