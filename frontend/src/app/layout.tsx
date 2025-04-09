import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apiverse",
  description: "A SaaS platform for ML API predictions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}