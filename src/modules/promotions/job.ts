import { logger } from "@/core/logger";
import { PromotionService } from "@/modules/promotions/service";

export abstract class PromotionJob {
  static JOB_ACTIVATE_SCHEDULED_NAME = "job-activate-scheduled-promotions";
  static JOB_DEACTIVATE_SCHEDULED_NAME =
    "job-deactivation-scheduled-promotions";

  static async activateScheduledPromotions() {
    const now = new Date();
    const promotionsToActivate = await PromotionService.findByScheduleTime(now);

    const meta = { job: this.JOB_ACTIVATE_SCHEDULED_NAME };

    if (promotionsToActivate.length === 0) {
      logger.info(meta, `No promotions to activate at ${now.toISOString()}`);
      return;
    }

    for (const promo of promotionsToActivate) {
      await PromotionService.activatePromotion(promo.id);
      logger.info(meta, `Activating promotion: ${promo.name}`);
    }
  }

  static async deactivateScheduledPromotions() {
    const now = new Date();
    const promotionsToDeactivate =
      await PromotionService.findActiveOutOfSchedule(now);

    if (promotionsToDeactivate.length === 0) {
      logger.info(
        { job: this.JOB_DEACTIVATE_SCHEDULED_NAME },
        `No promotions to deactivate at ${now.toISOString()}`,
      );
      return;
    }

    for (const promo of promotionsToDeactivate) {
      await PromotionService.deactivatePromotion(promo);
      logger.info(
        { job: this.JOB_DEACTIVATE_SCHEDULED_NAME },
        `Deactivating promotion: ${promo.name}`,
      );
    }
  }
}
