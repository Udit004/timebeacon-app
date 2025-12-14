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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
        <NotificationCenter />
      </body>
    </html>
  );
}
