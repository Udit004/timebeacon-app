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
        message: `Reminder scheduled for ${new Date(reminderTime).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}`,
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

      // Call API to mark as completed
      const response = await fetch(
        `${process.env.APP_URL}/api/reminder/${id}`,
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
