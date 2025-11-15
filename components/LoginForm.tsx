'use client';

import { loginUser } from "@/lib/api";
import { LoginRequest } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
    const {register, handleSubmit, formState: {errors}} = useForm<LoginRequest>();
    const router = useRouter();
    const [gender, setGender] = useState<string>('남자');

    const onSubmit = async (data: LoginRequest) => {
        try {
            const loginRes = await loginUser(data);
            sessionStorage.setItem('user', JSON.stringify({
                memberId: loginRes.memberId,
                name: loginRes.name,
                role: loginRes.role,
            }));
            if (loginRes.role === 'ADULT') {
                router.push('/adult');
            } else {
                router.push('/result');
            }
        } catch (error: any) {
            const status = error?.status ?? error?.response?.status ?? (typeof error === 'string' && error.includes('403') ? 403 : undefined);
            if (status === 403) {
                sessionStorage.setItem('signup', JSON.stringify({
                    name: data.name,
                    password: data.password,
                    gender,
                }));
                router.push('/questions');
                return;
            }

            alert(error?.message ?? '로그인에 실패했습니다.');
        };
    };

    const onInvalid = (errors: any) => {
        if (errors.name?.message) {
            alert(errors.name.message);
        } else if (errors.password?.message) {
            alert(errors.password.message);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col items-center gap-2">
                <div className="flex">
                    <input
                        {...register('name', { required: '이름을 입력하세요.' })}
                        placeholder="이름"
                        className="w-[268px] h-[35px] rounded-full border border-gray-300 px-3 font-[Pretendard]"
                    />
                </div>
                <div className="flex">
                    <input
                        {...register('password', { required: '비밀번호를 입력하세요.', minLength: {value: 4, message: '비밀번호를 4자리로 설정해주세요.'}, maxLength: {value: 4, message: '비밀번호를 4자리로 설정해주세요.'} })}
                        type="password"
                        placeholder="4자리 비밀번호"
                        className="w-[268px] h-[35px] rounded-full border border-gray-300 px-3 font-[Pretendard]"
                    />
                </div>
                <div className="flex justify-center items-center gap-2">
                    <select value={gender} onChange={e => setGender(e.target.value)} className="h-[35px] border border-gray-300 rounded-full px-3 font-[Pretendard]">
                        <option value="남자">남자</option>
                        <option value="여자">여자</option>
                    </select>
                </div>
                <button type="submit" className="text-2xl bg-orange-600 border border-gray-300 rounded-full px-5 py-2 mt-7 font-[MeetMe] text-white hover:bg-orange-700">시작하기</button>
            </form>
        </div>
    )
}