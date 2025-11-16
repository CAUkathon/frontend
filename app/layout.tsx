import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/common/Header";
import StyledLayoutWrapper from "@/components/common/StyledLayoutWrapper";

export const metadata: Metadata = {
  title: "멋사 조짜조",
  description: "나는 무슨 사자일까?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <StyledLayoutWrapper>
          {children}
        </StyledLayoutWrapper>
      </body>
    </html>
  );
}
