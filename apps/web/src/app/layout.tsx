import type { Metadata } from "next";
import localFont from "next/font/local";
import "../index.css";
import Providers from "@/components/providers";

const lineSeed = localFont({
  src: "../../public/fonts/LINESeedSansTH_Rg.ttf",
  variable: "--font-line-seed",
});

export const metadata: Metadata = {
  title: "WanderVoice",
  description: "AI-guided walking tour app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lineSeed.variable} antialiased`}>
        <Providers>
          <div className="h-svh overflow-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
