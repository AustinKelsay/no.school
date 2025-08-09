import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConfiguredThemeProvider } from "@/components/configured-theme-provider";
import { ThemeColorProvider } from "@/contexts/theme-context";
import { SnstrProvider } from "@/contexts/snstr-context";
import { QueryProvider } from "@/contexts/query-provider";
import { SessionProvider } from "@/contexts/session-provider";
import { ToastProvider } from "@/hooks/use-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlebDevs - Learn to Code on Lightning",
  description: "A one of a kind developer education, content, and community platform built on Nostr and fully Lightning integrated.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfiguredThemeProvider>
          <ThemeColorProvider>
            <QueryProvider>
              <SessionProvider>
                <ToastProvider>
                  <SnstrProvider>
                    {children}
                  </SnstrProvider>
                </ToastProvider>
              </SessionProvider>
            </QueryProvider>
          </ThemeColorProvider>
        </ConfiguredThemeProvider>
      </body>
    </html>
  );
}
