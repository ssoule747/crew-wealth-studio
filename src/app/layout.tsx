import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import TourProvider from "@/components/TourProvider";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  title: "Henry — AI Presentation Assistant by Crew Wealth",
  description:
    "Meet Henry, your AI presentation assistant. Upload last year's deck, tell Henry what to update, and get a polished result in seconds.",
  openGraph: {
    title: "Henry — AI Presentation Assistant by Crew Wealth",
    description:
      "Meet Henry — the AI concierge that updates wealth management presentations. Powered by Claude.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSerifDisplay.variable} ${dmSans.variable} font-sans antialiased bg-bg-primary min-h-screen`}
      >
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 10% 10%, rgba(201,169,110,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 90%, rgba(110,170,201,0.03) 0%, transparent 60%)",
          }}
        />
        <TourProvider>
          <div className="relative">{children}</div>
        </TourProvider>
      </body>
    </html>
  );
}
