import { IconDock } from "@/components/IconDock";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "A minimalistic link shortener with advanced features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
        <link
          rel="preconnect"
          href="https://jxjcxtzrqkusoxaqkzff.supabase.co"
        ></link>
      </head>
      <body className={inter.className}>
        {children}
        <IconDock />
        <Toaster richColors />
      </body>
    </html>
  );
}
