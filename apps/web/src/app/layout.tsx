import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ColorSchemeScript } from '@mantine/core';
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HMS SAAS - Hospital Management System",
  description: "Comprehensive Hospital Management System with 20+ modules for modern healthcare facilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
