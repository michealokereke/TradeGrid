import type { Metadata } from "next";
import "./globals.css";
import ProviderEntry from "@/components/providers/Index";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "TradeGrid - Field Service Management",
  description: "Manage your field service business efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ProviderEntry>{children}</ProviderEntry>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
