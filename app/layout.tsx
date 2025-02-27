import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "@/components/search/SearchProvider";
import { Toaster } from 'react-hot-toast';
import FloatingActionButton from "@/components/FloatingActionButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Otafli",
  description: "PCパーツのフリーマーケット",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <SearchProvider>
            <Header />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Footer />
            <FloatingActionButton href="/sell" label="商品を出品" />
          </SearchProvider>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
