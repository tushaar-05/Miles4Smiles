import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mayland Marathon | May 21–24 2025",
  description:
    "Join the Mayland Marathon — Full Marathon, Half Marathon, and more. Race day May 21–24 2025. Register now and be part of the run.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased overflow-x-hidden" style={{ background: '#F5F5F2' }}>
        {children}
      </body>
    </html>
  );
}
