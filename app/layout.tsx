import type { Metadata, Viewport } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f8fafc",
};

export const metadata: Metadata = {
  title: "AR SDLC Learning Media",
  description:
    "Interactive WebAR learning media for Software Development Life Cycle",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AR SDLC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col overscroll-none">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
