import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { reminderWorkflow } from "@/inngest/reminderWorkflow";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [reminderWorkflow],
});
