import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./QueryProvider";
import NotificationCenter from "@/components/NotificationCenter";


export const metadata: Metadata = {
  title: "TimeBeacon - Never Miss a Moment",
  description: "Set reminders that shine through your day. A beautiful and intuitive reminder app to help you stay organized and never miss important moments.",
  keywords: ["reminder", "time management", "productivity", "notifications", "task manager"],
  authors: [{ name: "TimeBeacon" }],
  openGraph: {
    title: "TimeBeacon - Never Miss a Moment",
    description: "Set reminders that shine through your day",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⏰</text></svg>" />
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
        <NotificationCenter />
      </body>
    </html>
  );
}
