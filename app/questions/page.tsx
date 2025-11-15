'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { joinUser } from "@/lib/api";

export default function QuestionsPage() {
	const router = useRouter();
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	function handleChange(q: string, value: string) {
		setAnswers(prev => ({ ...prev, [q]: value }));
	}

	async function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const signupRaw = sessionStorage.getItem('signup');
			const userRaw = sessionStorage.getItem('user');

			if (signupRaw) {
				const signup = JSON.parse(signupRaw);
				const payload = {
					name: signup.name,
					password: signup.password,
					gender: signup.gender,
					answers,
				};

				const res = await joinUser(payload);
				sessionStorage.setItem('user', JSON.stringify({ memberId: res.id ?? res.memberId ?? null, name: res.name, role: res.role }));
				sessionStorage.removeItem('signup');
				router.push('/result');
				return;
			}

			if (userRaw) {
				router.push('/result');
				return;
			}

			router.push('/login');
		} catch (err: any) {
			setError(err?.message ?? '제출 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="w-full p-6 flex flex-col items-center gap-6 max-w-[375px] mx-auto">
			<h1 className="text-3xl font-bold">질문 페이지</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
				<div className="mb-3">
					<label className="mr-2 font-[Pretendard]">성별</label>
					<select onChange={e => handleChange('gender', e.target.value)} className="h-[35px] border border-gray-300 rounded-full px-3 font-[Pretendard]">
						<option value="">선택</option>
						<option value="남자">남자</option>
						<option value="여자">여자</option>
					</select>
				</div>
				{error && <p className="text-red-500 text-sm">{error}</p>}
				<button type="submit" disabled={loading} className="px-6 py-3 border-none rounded-lg bg-orange-600 text-white text-base cursor-pointer font-[Pretendard] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-orange-700">
					{loading ? '제출중...' : '제출'}
				</button>
			</form>
		</div>
	);
}