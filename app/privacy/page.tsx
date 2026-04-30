import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — FitCalc",
  description: "Privacy Policy for FitCalc. Learn how we handle your data and use of Google AdSense.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h2>
      <div className="space-y-3 text-slate-600 leading-relaxed text-sm">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-colors">
          ← Back to FitCalc
        </Link>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Privacy Policy</h1>
        <p className="text-slate-500 text-sm">
          Last updated: <strong>April 30, 2026</strong>
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10">

        <Section title="1. Introduction">
          <p>
            Welcome to <strong>FitCalc</strong> ("we", "our", or "us"), accessible at{" "}
            <a href="https://fitness-calculators.vercel.app" className="text-emerald-600 hover:underline">
              https://fitness-calculators.vercel.app
            </a>
            . We are committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, and safeguard information when you visit our website.
          </p>
          <p>
            By using FitCalc, you agree to the terms described in this policy. If you do not agree,
            please discontinue use of the site.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>
            <strong>We do not collect personal information directly.</strong> FitCalc does not require
            you to create an account, log in, or submit any personally identifying information.
          </p>
          <p>
            All fitness calculations (BMI, TDEE, Macros, Body Fat, 1 Rep Max, Heart Rate Zones, Ideal
            Body Weight, and Water Intake) are performed entirely in your browser. The values you enter
            are never sent to our servers.
          </p>
          <p>
            We may automatically receive standard technical data through your browser, such as your IP
            address, browser type, operating system, and referring URL. This information is used solely
            for operational and security purposes.
          </p>
        </Section>

        <Section title="3. Google AdSense & Cookies">
          <p>
            FitCalc uses <strong>Google AdSense</strong> to display advertisements. Google AdSense may
            use cookies and similar tracking technologies to show you relevant ads based on your
            browsing history across websites.
          </p>
          <p>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based on
            your visit to FitCalc and other sites on the internet. You may opt out of personalised
            advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Google&apos;s Ads Settings
            </a>
            .
          </p>
          <p>
            For more information on how Google collects and uses data, please see Google&apos;s{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </Section>

        <Section title="4. Third-Party Services">
          <p>
            Our website is hosted on <strong>Vercel</strong>. Vercel may collect standard server log
            data such as request timestamps, IP addresses, and response codes for security and
            performance monitoring. Please refer to{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Vercel&apos;s Privacy Policy
            </a>{" "}
            for details.
          </p>
          <p>
            We may include links to external websites or affiliate product pages. We are not responsible
            for the privacy practices or content of those sites.
          </p>
        </Section>

        <Section title="5. Cookies">
          <p>
            FitCalc itself does not set first-party cookies. However, Google AdSense sets third-party
            cookies for ad personalisation and measurement purposes.
          </p>
          <p>
            You can control cookies through your browser settings. Note that disabling cookies may
            affect how ads are displayed but will not affect the functionality of our calculators.
          </p>
        </Section>

        <Section title="6. Children's Privacy">
          <p>
            FitCalc is not directed at children under the age of 13. We do not knowingly collect
            personal information from children. If you believe a child has provided personal information
            through our site, please contact us and we will promptly remove it.
          </p>
        </Section>

        <Section title="7. Your Rights (GDPR & CCPA)">
          <p>
            If you are located in the European Economic Area (EEA) or California, you may have
            additional rights regarding your personal data, including the right to access, correct, or
            delete any information we hold about you.
          </p>
          <p>
            Since FitCalc does not collect personal data directly, most of these rights apply to data
            held by our third-party providers (Google, Vercel). Please contact those providers
            directly for requests related to data they hold.
          </p>
          <p>
            You may opt out of Google&apos;s personalised advertising at any time via{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Google&apos;s Ads Settings
            </a>
            {" "}or through the{" "}
            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Digital Advertising Alliance opt-out tool
            </a>
            .
          </p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page with an updated revision date. We encourage you to review this page periodically.
            Continued use of FitCalc after changes constitutes your acceptance of the revised policy.
          </p>
        </Section>

        <Section title="9. Contact Us">
          <p>
            If you have any questions or concerns about this Privacy Policy, you can reach us at:
          </p>
          <div className="bg-slate-50 rounded-2xl px-5 py-4 mt-2">
            <p className="font-semibold text-slate-800">FitCalc</p>
            <p>
              Email:{" "}
              <a href="mailto:tc.jony.tap@gmail.com" className="text-emerald-600 hover:underline">
                tc.jony.tap@gmail.com
              </a>
            </p>
            <p>Website: <a href="https://fitness-calculators.vercel.app" className="text-emerald-600 hover:underline">https://fitness-calculators.vercel.app</a></p>
          </div>
        </Section>

      </div>
    </div>
  );
}
