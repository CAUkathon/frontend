/**
 * MyPage
 * - 아기사자 결과 페이지 컴포넌트
 * - URL에서 id를 추출하여 해당 사용자의 결과 정보를 API에서 가져옴
 * - 사용자 정보 로딩 중에는 로딩 화면 표시
 * - 사용자 정보가 없거나 에러 발생 시 alert 띄우고 처음 화면으로 이동
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserInfo } from '@/lib/api';

interface UserResult {
  id: number;
  name: string;
  role: string;
  answer: string;
  image: string;
  description: string;
  teamBuilt: boolean;
}

export default function MyPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params; // URL에서 id 추출
  const [user, setUser] = useState<UserResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserInfo(Number(id));
        setUser(data);
      } catch (err: any) {
        console.error(err);
        alert('사용자 정보를 불러오지 못했습니다.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg font-[MeetMe]">로딩 중...</div>;

  if (!user) return null;

  return (
    <div className="w-full max-w-[375px] flex flex-col justify-center items-center gap-6" style={{ height: 'calc(100vh - var(--header-height))' }}>
      <h2 className="text-3xl">당신은... {user.answer}!</h2>
      <div className="w-[300px] relative">
        <img src={user.image} alt={user.answer} className="w-[300px] object-contain" />
        <p className="text-[22px] text-center text-orange-500">{user.description}</p>
      </div>

      <button className="text-2xl border border-gray-300 rounded-full px-5 py-2 mt-6 text-white hover:brightness-95" style={{ backgroundColor: '#FF6F00' }}>
        우리 조 보러 가기
      </button>
    </div>
  );
}