import { IconDock } from "@/components/IconDock";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alfa Beta",
  description: "The only online toolbox you'll ever need. Feature rich and minimalistic. - Made with ❤️ by @arctixdev.",
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
        {process.env.NODE_ENV === "development" && <IconDock />}
        <Toaster richColors />
      </body>
    </html>
  );
}
