import { IconDock } from "@/components/IconDock";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ClientIconUpdater from "./iconupdater";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alfa Beta",
  description:
    "The only link shortener you'll ever need. Feature rich and minimalistic. - Made with ❤️ by @jonba_.",
  applicationName: "Alfa Beta",
  themeColor: "#FFFFFF",
  colorScheme: "light",
  creator: "Jonathan Bangert",
  publisher: "Jonathan Bangert",
  keywords: ["toolbox", "alfa", "beta", "jonba_"],
  viewport: "width=device-width, initial-scale=1.0",
  twitter: {
    site: "@jonba_",
    creator: "@jonba_",
    card: "summary_large_image",
    creatorId: "jonba_",
    description: "The only link shortener you'll ever need. Feature rich and minimalistic. - Made with ❤️ by @jonba_.",
    siteId: "jonba_",
    title: "Alfa Beta",
    images: [
      {
        url: "https://alfabeta.dk/og-image.png",
        alt: "Alfa Beta",
      }
    ]
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alfabeta.dk",
    title: "Alfa Beta",
    description: "The only link shortener you'll ever need. Feature rich and minimalistic. - Made with ❤️ by @jonba_.",
    siteName: "Alfa Beta",
    emails: "contact@alfabeta.dk",
    images: [
      {
        url: "https://alfabeta.dk/og-image.png",
        alt: "Alfa Beta",
      }
    ],
  },
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
        />
      </head>
      <body className={inter.className}>
        <ClientIconUpdater />
        {children}
        {process.env.NODE_ENV === "development" && <IconDock />}
        <Toaster richColors />
        <footer className="text-center text-sm text-muted-foreground py-4 fixed bottom-0 left-0 right-0">
          <p>
            Made with ❤️ by{" "}
            <a href="https://x.com/jonba_" target="_blank" className="hover:underline">
              @jonba_
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
