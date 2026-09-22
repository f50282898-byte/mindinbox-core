import type { Metadata } from "next";
import { Cinzel, Inter, Amiri } from "next/font/google";
import "./globals.css";
import BackgroundCanvas from "@/components/BackgroundCanvas";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: "Mind in a Box | عقل في صندوق",
  description: "The Sanctuary of the Mind - A premium philosophical ecosystem.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body
        className={`${cinzel.variable} ${inter.variable} ${amiri.variable} bg-obsidian text-gold-light antialiased min-h-screen relative overflow-x-hidden`}
      >
        <BackgroundCanvas />
        <main className="relative z-10 font-amiri">
          {children}
        </main>
      </body>
    </html>
  );
}

