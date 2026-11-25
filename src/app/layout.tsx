import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import { draftMode } from "next/headers";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentfulPreviewProvider from "@/components/ContentfulPreviewProvider";
import SessionWrapper from "@/components/SessionWrapper";
import ClaudeAssistant from "@/components/ClaudeAssistant";

const serif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Claude Partner Hub",
  description:
    "The Claude Partner Network — resources, enablement, and everything you need to build and sell with Claude.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = draftMode();

  return (
    <html lang="en" className={serif.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <SessionWrapper>
          <ContentfulPreviewProvider isDraftMode={isDraftMode}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ClaudeAssistant />
          </ContentfulPreviewProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
