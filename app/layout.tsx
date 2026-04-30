import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitCalc — Free Fitness Calculators",
  description: "Free fitness calculators: BMI, TDEE, Macros, Body Fat, 1 Rep Max, Heart Rate Zones, Ideal Body Weight, Water Intake.",
  metadataBase: new URL("https://fitness-calculators.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FitCalc — Free Fitness Calculators",
    description: "Free fitness calculators: BMI, TDEE, Macros, Body Fat, 1 Rep Max, Heart Rate Zones, Ideal Body Weight, Water Intake.",
    url: "https://fitness-calculators.vercel.app",
    siteName: "FitCalc",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FitCalc — Free Fitness Calculators",
    description: "Free fitness calculators: BMI, TDEE, Macros, Body Fat, 1 Rep Max, Heart Rate Zones, Ideal Body Weight, Water Intake.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2607428575036247"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </html>
  );
}
