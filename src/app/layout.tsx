import type { Metadata } from "next";
import { Inter, Amiri, Cinzel } from "next/font/google";
import "./globals.css";
import SacredBackground from "@/components/layout/SacredBackground";
import LangToggle from "@/components/ui/LangToggle";
import { WebVitals } from "@/components/performance/WebVitals";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-amiri" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "عقل في صندوق | رحلة الوعي تبدأ هنا",
  description: "ملاذ آمن للنخبة، حيث يتلاقى الذكاء الاصطناعي مع أعظم الفلسفات البشرية.",
  openGraph: {
    title: "عقل في صندوق | Mind in a Box",
    description: "ملاذ آمن للنخبة، حيث يتلاقى الذكاء الاصطناعي مع أعظم الفلسفات البشرية.",
    url: "https://mindinbox.com",
    siteName: "Mind in a Box",
    images: [
      {
        url: "https://mindinbox.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mind in a Box - Elite Philosophical AI",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "عقل في صندوق | رحلة الوعي تبدأ هنا",
    description: "ملاذ آمن للنخبة، حيث يتلاقى الذكاء الاصطناعي مع أعظم الفلسفات البشرية.",
    images: ["https://mindinbox.com/twitter-image.jpg"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mindinbox.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className="dark">
      <body className={`${inter.variable} ${amiri.variable} ${cinzel.variable} font-sans bg-obsidian text-neutral-200 antialiased relative selection:bg-gold/30 selection:text-gold-light`}>
        <WebVitals />
        <LangToggle initialLocale={locale} />
        <SacredBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}

