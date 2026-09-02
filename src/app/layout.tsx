import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Miles for Smiles 5K | September 05, 2026",
  description:
    "Official Miles for Smiles 5K Charity Marathon — Join the run, bring smiles, and support pediatric health. September 05, 2026.",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/images/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased overflow-x-hidden" style={{ background: '#F5F5F2' }}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
