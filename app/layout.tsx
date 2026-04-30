import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "FitCalc — Free Fitness Calculators",
  description: "Free fitness calculators: BMI, TDEE, Macros, Body Fat, 1 Rep Max, Heart Rate Zones, Ideal Body Weight, Water Intake.",
  metadataBase: new URL("https://fitness-calculators.vercel.app"),
  alternates: { canonical: "/" },
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
  robots: { index: true, follow: true },
};

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-lg shadow-md group-hover:bg-emerald-400 transition-colors">
            💪
          </div>
          <div>
            <span className="text-white font-extrabold text-lg leading-none tracking-tight">FitCalc</span>
            <p className="text-emerald-400 text-xs leading-none mt-0.5 font-medium">Fitness Calculators</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/" className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
            Calculators
          </Link>
          <Link href="/privacy" className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium">
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  const tools = [
    "BMI Calculator",
    "TDEE Calculator",
    "Macro Calculator",
    "Body Fat %",
    "1 Rep Max",
    "Heart Rate Zones",
    "Ideal Body Weight",
    "Water Intake",
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-base">💪</div>
              <span className="text-white font-bold text-base">FitCalc</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Science-based fitness calculators for everyone. Free, instant, and no account needed.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Calculators</h4>
            <ul className="space-y-2.5">
              {tools.map((t) => (
                <li key={t}>
                  <Link href="/" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="mt-8 p-4 bg-slate-800 rounded-xl">
              <p className="text-xs text-slate-500 leading-relaxed">
                Results are for informational purposes only. Always consult a qualified healthcare professional for personal medical guidance.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} FitCalc. All rights reserved.</p>
          <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-[family-name:var(--font-geist)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2607428575036247"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </html>
  );
}
