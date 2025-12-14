import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "timebeacon-app",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
