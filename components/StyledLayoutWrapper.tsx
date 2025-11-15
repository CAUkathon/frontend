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
