import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landing Builder",
  description: "Constructor de landing de plantilla fija"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}

