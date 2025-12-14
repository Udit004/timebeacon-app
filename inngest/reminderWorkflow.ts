import { inngest } from "@/lib/inngest";
import { pusherServer } from "@/lib/pusher";

export const reminderWorkflow = inngest.createFunction(
  { id: "reminder-workflow" },
  { event: "reminder/created" },
  async ({ event, step }) => {
    const { id, remindAt } = event.data as { id: string; remindAt: string };

    try {
      const reminderTime = new Date(remindAt).getTime();
      const currentTime = Date.now();
      const delay = reminderTime - currentTime;

      console.log(`\n📅 Reminder ${id}:`);
      console.log(`  Scheduled (UTC): ${new Date(reminderTime).toISOString()}`);
      console.log(
        `  Scheduled (IST): ${new Date(reminderTime).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}`
      );
      console.log(`  Current (UTC): ${new Date(currentTime).toISOString()}`);
      console.log(`  Delay: ${Math.ceil(delay / 1000)} seconds\n`);

      // Send notification that reminder is scheduled
      await pusherServer.trigger("reminders", "reminder-scheduled", {
        reminderId: id,
        message: `Reminder scheduled for ${new Date(reminderTime).toLocaleString(
          "en-IN",
          { timeZone: "Asia/Kolkata" }
        )}`,
        timestamp: new Date().toISOString(),
      });

      // Only sleep if delay is positive
      if (delay > 0) {
        const delayInSeconds = Math.ceil(delay / 1000);
        await step.sleep(`wait-reminder-${id}`, `${delayInSeconds}s`);
      } else {
        console.warn(`⚠️ Reminder ${id} is in the past. Executing immediately.`);
      }

      console.log(`✅ Reminder ${id} is due! Marking as COMPLETED...`);

      // ✅ Call API to mark as completed
      // Use Vercel URL in production, localhost in development
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      const response = await fetch(
        `${baseUrl}/api/reminder/${id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            status: "COMPLETED",
          }),
        }
      );

      // ✅ Handle 404 gracefully (reminder was deleted)
      if (response.status === 404) {
        console.log(
          `⏭️ Reminder ${id} not found (likely deleted). Skipping execution...`
        );

        // Send notification that reminder was deleted
        await pusherServer.trigger("reminders", "reminder-skipped", {
          reminderId: id,
          message: "Reminder was deleted before execution",
          reason: "DELETED",
          timestamp: new Date().toISOString(),
        });

        // ✅ Return gracefully - NO ERROR, NO RETRY
        return {
          skipped: true,
          reminderId: id,
          reason: "reminder_deleted",
        };
      }

      // ✅ Handle other errors
      if (!response.ok) {
        throw new Error(`Failed to update reminder: ${response.statusText}`);
      }

      // Send notification that reminder is completed
      await pusherServer.trigger("reminders", "reminder-completed", {
        reminderId: id,
        message: `Reminder completed!`,
        timestamp: new Date().toISOString(),
      });

      console.log(`✅ Reminder ${id} updated successfully\n`);
      return { success: true, reminderId: id };
    } catch (error) {
      console.error(`❌ Error processing reminder ${id}:`, error);

      // Send error notification
      await pusherServer.trigger("reminders", "reminder-error", {
        reminderId: id,
        message: `Error processing reminder: ${error}`,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }
);
