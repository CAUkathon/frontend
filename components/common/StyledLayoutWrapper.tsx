/**
 * StyledLayoutWrapper
 * - 공통 레이아웃 wrapper
 * - 화면 중앙 정렬, 최소 높이는 (뷰포트 - Header 높이)
 * - children으로 전달된 컴포넌트를 감싸는 용도
 */

'use client';

import { ReactNode } from "react";

export default function StyledLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full min-h-[calc(100dvh-var(--header-height))] flex flex-col justify-center items-center">
      {children}
    </div>
  );
}
