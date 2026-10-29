import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProviders } from "@/app/providers"
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://feedo.com"),
  title: {
    default: "Feedo",
    template: "%s",
  },
  description: "Connect and share with your community.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-background`}
    >
      <QueryProviders>
        <body className="min-h-full flex flex-col">{children}<Toaster /></body>
      </QueryProviders>
    </html>
  );
}
