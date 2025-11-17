'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL, getUserInfo } from '@/lib/api';

interface UserResult {
  id: number;
  name: string;
  role: string;
  answer: string;
  image: string;
  description: string;
  teamBuilt: boolean;
  teamId?: number;          // 팀 ID 추가
}

export default function MyPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [user, setUser] = useState<UserResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserInfo(Number(id));
        setUser(data);
      } catch (err) {
        console.error(err);
        alert('사용자 정보를 불러오지 못했습니다.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        로딩 중...
      </div>
    );

  if (!user) return null;

  // 클릭 핸들러
  const handleGoTeam = async () => {
    if (!user?.teamBuilt) return;

    try {
      const res = await fetch(`${API_BASE_URL}/team`);
      const data = await res.json();

      const teamIndex = data.teams.findIndex((team: any) =>
        team.members.some((m: any) => m.name === user.name)
      );

      if (teamIndex === -1) {
        alert("아직 팀이 배정되지 않았습니다.");
        return;
      }

      router.push(`/team/${teamIndex + 1}`); // teamId = index + 1
    } catch (err) {
      console.error(err);
      alert("팀 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="w-full max-w-[375px] flex flex-col justify-center items-center gap-4"
      style={{ height: 'calc(100vh - var(--header-height))' }}
    >
      <h2 className="text-3xl">당신은... {user.answer}!</h2>

      <div className="flex flex-col items-center gap-4 w-60 relative">
        <img src={user.image} alt={user.answer} />
        <p className="text-[22px] text-center text-orange-500">
          {user.description}
        </p>
      </div>

      {/* 버튼 상태 반영 */}
      <button
        onClick={handleGoTeam}
        disabled={!user.teamBuilt}
        className={`text-2xl border border-gray-300 rounded-full px-5 py-2 mt-6 transition 
          ${
            user.teamBuilt
              ? 'text-white bg-[#FF6F00] hover:brightness-95'
              : 'bg-gray-300 text-gray-500'
          }`}
      >
        우리 조 보러 가기
      </button>

      {!user.teamBuilt && (
        <p className="text-gray-500">
          아직 팀 배정이 완료되지 않았습니다. 조금만 기다려주세요!
        </p>
      )}
    </div>
  );
}
