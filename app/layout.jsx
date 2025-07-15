// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Carga las fuentes con variables CSS
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Exporta los metadatos de la app
export const metadata = {
  title: "Work From Home Talent",
  description: "We connect companies with top-tier remote professionals.",
};

// Layout raíz que envuelve todas las páginas
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}

