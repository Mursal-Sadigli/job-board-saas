import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  title: "WDS Jobs – Xəyalınızdakı İşi Tapın",
  description:
    "AI ilə dəstəklənən müasir iş elanları platforması. Bacarıq və seçimlərinizə uyğun ən yaxşı texnoloji işləri tapın.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/Toaster";
import UserSync from "@/components/UserSync";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <UserSync />
      <html lang="az" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
        <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen bg-background`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
