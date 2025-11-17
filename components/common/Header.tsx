/**
 * Header
 * - 페이지 상단 헤더 컴포넌트
 * - 텍스트 '멋사 조짜조' 표시
 * - 전체 페이지에서 height는 CSS 변수(--header-height) 참조 (globals.css에 있음)
 */

'use client';

import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    return (
        <header className="w-full h-(--header-height) flex items-center justify-center border-b-2 border-dashed border-gray-300">
            <p className="text-4xl m-0 text-black select-none cursor-pointer" style={{ fontFamily: 'OkDanDan' }} onClick={() => router.push("/")}>
                멋사 조짜조
            </p>
        </header>
    )
}