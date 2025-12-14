import { Inngest } from "inngest";

// Debug: Check if keys are available
const hasEventKey = !!process.env.INNGEST_EVENT_KEY;
const hasSigningKey = !!process.env.INNGEST_SIGNING_KEY;

console.log("🔍 Inngest Config Check:", {
  hasEventKey,
  hasSigningKey,
  nodeEnv: process.env.NODE_ENV,
  eventKeyLength: process.env.INNGEST_EVENT_KEY?.length || 0,
});

if (!hasEventKey || !hasSigningKey) {
  console.warn("⚠️  WARNING: Missing Inngest keys! Will use local dev server.");
}

export const inngest = new Inngest({
  id: "timebeacon-app",
});
