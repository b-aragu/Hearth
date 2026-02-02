import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Hearth - Grow Something Beautiful Together",
  description: "The app for couples to build better habits. Raise a virtual companion, share daily moments, and strengthen your bond. Download today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${dmSans.variable} font-sans bg-[#FFF9F0] text-charcoal antialiased overflow-x-hidden selection:bg-coral selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
