import { logger } from "@/core/logger";
import { PromotionService } from "@/modules/promotions/service";

export abstract class PromotionJob {
  static JOB_ACTIVATE_SCHEDULED_NAME = "job-activate-scheduled-promotions";

  static async activateScheduledPromotions() {
    const now = new Date();
    const promotionsToActivate = await PromotionService.findByScheduleTime(now);

    const meta = { job: this.JOB_ACTIVATE_SCHEDULED_NAME };

    if (promotionsToActivate.length === 0) {
      logger.info(meta, `No promotions to activate at ${now.toISOString()}`);
      return;
    }

    // TODO: Activas una promocion y desactivas las anteriores. Solo activas las nuevas.

    for (const promo of promotionsToActivate) {
      await PromotionService.activatePromotion(promo.id);
      logger.info(meta, `Activating promotion: ${promo.name}`);
    }
  }
}
