import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "timebeacon-app",
  eventKey: process.env.INNGEST_EVENT_KEY!,
  // Force cloud usage by explicitly setting the endpoint
  isDev: false,
  baseURL: "https://api.inngest.com",
});
