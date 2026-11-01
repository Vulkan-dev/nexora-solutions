import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/canvas/CustomCursor";
import ParticleBackground from "@/components/canvas/ParticleBackground";
import SmoothScroll from "@/components/ui/SmoothScroll";
import SessionProviderWrapper from "@/components/ui/SessionProviderWrapper";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "RADIANT | Kinetic Web Architecture & Full-Stack Platform",
  description:
    "Ultra-high performance, cinematic digital platform engineered with Next.js 14, spring-physics interactions, and enterprise security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-neutral-100 antialiased flex flex-col selection:bg-blue-600/30 selection:text-white">
        <SessionProviderWrapper>
          <SmoothScroll>
            {/* Ambient Kinetic Canvas Layers */}
            <ParticleBackground />
            <CustomCursor />

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
