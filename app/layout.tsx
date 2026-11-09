import ClientShield from '@/components/security/ClientShield';
import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/canvas/CustomCursor";
import ParticleBackground from "@/components/canvas/ParticleBackground";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SessionProviderWrapper from "@/components/ui/SessionProviderWrapper";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";

export const metadata: Metadata = {
  title: "Nexora Solutions | Full-Stack Web, SaaS & Discord Systems",
  description:
    "Modern full-stack web applications, scalable SaaS platforms, and custom Discord bots built with clean code and high performance.",
  icons: {
    icon: [
      { url: "/tab-icon.png?v=3", type: "image/png" },
      { url: "/64x64.png?v=3", sizes: "64x64", type: "image/png" },
      { url: "/favicon.ico?v=3" },
    ],
    shortcut: "/tab-icon.png?v=3",
    apple: [
      { url: "/tab-icon.png?v=3", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/tab-icon.png?v=3" sizes="any" type="image/png" />
        <link rel="shortcut icon" href="/tab-icon.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/tab-icon.png?v=3" />
      </head>
      <body className="min-h-screen bg-background text-neutral-900 antialiased flex flex-col selection:bg-amber-700/20 selection:text-neutral-900 w-full overflow-x-hidden">
        <SessionProviderWrapper>
          <SmoothScroll>
            {/* Custom Cinematic Loading Screen */}
            <LoadingScreen />

            {/* Ambient Kinetic Canvas Layers */}
            <ParticleBackground />
            <CustomCursor />
            <ClientShield />

            {/* Persistent Navigation */}
            <Navbar />

            {/* Main Page Content */}
            <main className="flex-1 flex flex-col">{children}</main>

            {/* Platform Footer */}
            <Footer />
          </SmoothScroll>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
