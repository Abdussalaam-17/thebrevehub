import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/providers/AuthProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: "The Breve Hub — Premium 50-Seater Conference & Training Hall, Ibadan",
  description:
    "Book The Breve Hub in Molete, Ibadan. 50-seater conference & training hall with WiFi, smart screen, PA system, AC, LED stage. ₦35,000/hour.",
  openGraph: {
    title: "The Breve Hub — Premium Hall in Ibadan",
    description: "50 seats • WiFi • Smart Screen • PA • AC • LED Stage. Book online.",
    images: ["/images/hall-hero.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-cream">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
