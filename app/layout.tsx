import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEEPANSHI — Everything You Love, In One Place",
  description: "DEEPANSHI is a modern multi-category online marketplace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}