import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "How Are You Feeling? · English Club",
  description: "An interactive emotions wheel and anonymous hourly check-in for English Club.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
