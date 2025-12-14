import { Inngest } from "inngest";

// Only provide eventKey when it exists (production/cloud mode)
// In development without eventKey, Inngest will use dev server
const config: any = {
  id: "timebeacon-app",
};

if (process.env.INNGEST_EVENT_KEY) {
  console.log("✅ INNGEST_EVENT_KEY found, using Inngest Cloud");
  config.eventKey = process.env.INNGEST_EVENT_KEY;
  config.isDev = false;
} else {
  console.warn("⚠️ INNGEST_EVENT_KEY not found, will try to use dev server");
}

export const inngest = new Inngest(config);
