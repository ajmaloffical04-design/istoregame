import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apple vs Android - Choose Your Side",
  description: "The ultimate showdown. Choose your side and watch your team win in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen bg-gray-900 text-white selection:bg-white selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
