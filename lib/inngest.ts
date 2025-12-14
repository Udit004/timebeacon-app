import { Inngest } from "inngest";

// Only provide eventKey when it exists (production/cloud mode)
// In development without eventKey, Inngest will use dev server
const config: any = {
  id: "timebeacon-app",
};

if (process.env.INNGEST_EVENT_KEY) {
  config.eventKey = process.env.INNGEST_EVENT_KEY;
  config.isDev = false;
}

export const inngest = new Inngest(config);
