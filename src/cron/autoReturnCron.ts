import cron from "node-cron";
import { bookingService } from "../modules/booking/booking.service";

cron.schedule("*/5 * * * *", async () => {
  try {
    const result = await bookingService.autoReturnBookingsService();
    console.log(`Auto-return cron: ${result.updatedCount} bookings updated`);
  } catch (err) {
    console.error("Auto-return cron job error:", err);
  }
});
