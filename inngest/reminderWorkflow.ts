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

      // ✅ Update reminder directly in database (avoid API call issues in production)
      const { prisma } = await import("@/lib/prisma");
      
      const reminder = await step.run("update-reminder-status", async () => {
        try {
          // Check if reminder exists
          const existingReminder = await prisma.reminder.findUnique({
            where: { id },
          });

          // Handle deleted reminder
          if (!existingReminder) {
            console.log(
              `⏭️ Reminder ${id} not found (likely deleted). Skipping execution...`
            );
            return null;
          }

          // Update status
          return await prisma.reminder.update({
            where: { id },
            data: { status: "COMPLETED" },
          });
        } catch (error) {
          console.error(`❌ Error updating reminder ${id}:`, error);
          throw error;
        }
      });

      // Handle deleted reminder
      if (!reminder) {
        await pusherServer.trigger("reminders", "reminder-skipped", {
          reminderId: id,
          message: "Reminder was deleted before execution",
          reason: "DELETED",
          timestamp: new Date().toISOString(),
        });

        return {
          skipped: true,
          reminderId: id,
          reason: "reminder_deleted",
        };
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
