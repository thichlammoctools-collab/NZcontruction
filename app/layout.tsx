import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NS Building | Residential Renovation & Construction Specialists New Zealand",
  description:
    "Master residential renovation, luxury bathrooms, custom cabinetry, timber flooring, and property repairs across Auckland & New Zealand. Licensed & insured craftsmen.",
  keywords: [
    "Auckland builders",
    "home renovations New Zealand",
    "bathroom renovation Auckland",
    "flooring specialist NZ",
    "custom cabinetry Auckland",
    "NS Building",
    "Nguyen Son",
    "tradies Auckland",
  ],
  metadataBase: new URL("https://nsbuilding.co.nz"),
  openGraph: {
    title: "NS Building | New Zealand Residential Craftsmen",
    description: "Building better homes across Auckland & New Zealand. Quality renovations, bathrooms, flooring and cabinetry.",
    url: "https://nsbuilding.co.nz",
    siteName: "NS Building",
    locale: "en_NZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
