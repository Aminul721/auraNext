import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const siteUrl = "https://aurahumanoidtech.com";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AURA HUMANOID TECH | Premium Humanoid Robotics",
  description:
    "AURA HUMANOID TECH provides premium futuristic humanoid robotics solutions for corporate events, product launches, expos, and education in Malaysia.",
  keywords: [
    "Humanoid Robot Malaysia",
    "Humanoid Robotics Malaysia",
    "Aura Malaysia",
    "Robotics Events Malaysia",
    "Corporate Robotics",
    "STEM Robotics Workshop",
    "Humanoid Robot Event",
    "Robotics Exhibition Malaysia",
  ],
  authors: [{ name: "AURA HUMANOID TECH" }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "AURA HUMANOID TECH | Futuristic Humanoid Robotics Malaysia",
    description:
      "Premium humanoid robotics solutions for corporate events, product launches, expos, and education.",
    type: "website",
    url: siteUrl,
    images: ["https://aurahumanoidtech.com/assets/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA HUMANOID TECH | Futuristic Humanoid Robotics Malaysia",
    description:
      "Premium humanoid robotics solutions for corporate events, product launches, expos, and education.",
  },
};

const organizationData = {
  "@context": "https://schema.org",
  "@type": "Corporation",
  name: "AURA HUMANOID TECH",
  url: siteUrl,
  logo: `${siteUrl}/assets/logo.png`,
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+60102090179",
      contactType: "customer service",
      email: "info@aurahumanoidtech.com",
      areaServed: "MY",
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 1, Jalan Anggerik Tainia AW 31/AW",
    addressLocality: "Kota Kemuning, Shah Alam",
    addressRegion: "Selangor",
    postalCode: "40460",
    addressCountry: "MY",
  },
  taxID: "003884766-K",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>{children}</body>
    </html>
  );
}
