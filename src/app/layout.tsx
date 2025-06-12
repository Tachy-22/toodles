import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import ThemeProvider from "@/presentation/providers/ThemeProvider";
import { AppProvider } from "@/presentation/providers/AppProvider";
import { Toaster } from "@/presentation/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/presentation/components/ui/sonner";
import dynamic from "next/dynamic";

// Import Navbar with no SSR to avoid hydration issues
const Navbar = dynamic(
  () => import("@/presentation/components/common/Navbar"),
  { ssr: false }
);

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Toodles - Todo App",
  description: "A clean architecture todo app built with Next.js and Firebase",
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
        suppressHydrationWarning
      >
        <AppProvider>
          <ThemeProvider>
            <Navbar />
            {children}
            <Toaster />
            <SonnerToaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
