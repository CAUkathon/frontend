/**
 * LoginPage
 * - 로그인 화면 전체 레이아웃 컴포넌트
 * - 중앙에 로고 이미지와 LoginForm을 배치
 * - 모바일 최대 폭 375px 기준으로 가운데 정렬
 */

'use client';

import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col items-center gap-9 w-full max-w-[375px]">
                <img src="/images/bubble.png" width={200} />
                <img src="/images/main_lion.png" width={200} />

                {/* 로그인 입력 폼 */}
                <LoginForm />
            </div>
        </div>
    )
}