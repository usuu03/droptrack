import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { AuthProvider } from "./contexts/AuthContext";
import SubscriptionBanner from "./components/SubscriptionBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrackerBot - Amazon to eBay Tracking Conversion",
  description:
    "Automate your eBay dropshipping tracking updates with TrackerBot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <SubscriptionBanner />
            <main className="py-10">
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
