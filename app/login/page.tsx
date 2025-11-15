'use client';

import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col items-center gap-9 w-full max-w-[375px]">
                <img src="/images/bubble.png" width={200} />
                <img src="/images/main_lion.png" width={200} />
                <LoginForm />
            </div>
        </div>
    )
}