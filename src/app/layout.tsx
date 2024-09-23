import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from '@/components/AuthProvider'
import Header from '@/components/layout/Header'

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
  title: "Esport Job Board",
  description: "Find your next career in esports and gaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <AuthProvider>
          <Header />
          <main className="container mx-auto mt-8 px-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}