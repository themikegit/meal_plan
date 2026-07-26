import type { Metadata, Viewport } from "next";
import { Caprasimo, Figtree } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import LangProvider from "@/components/LangProvider";
import "./globals.css";

const caprasimo = Caprasimo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caprasimo",
});

const figtree = Figtree({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Meso First",
  description: "Protein-first meal & grocery planner",
  applicationName: "Meso First",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Meso First",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5ead8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${caprasimo.variable} ${figtree.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-bg text-text">
          <LangProvider>
            <ServiceWorkerRegister />
            <main className="flex-1 pb-24 safe-pt">{children}</main>
            {userId ? <BottomNav /> : null}
          </LangProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
