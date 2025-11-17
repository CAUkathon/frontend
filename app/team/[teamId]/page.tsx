"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

// key를 한국어 라벨로 바꿔주는 매핑 함수
function convertLabel(key: string) {
  const map: Record<string, string> = {
    mbti: "MBTI",
    hobby: "취미/관심사",
    favoriteFood: "좋아하는 음식",
    wildLionAnswer: "야생의 사자를 만나면",
    drinkScore: "음주 선호도",
  };

  return map[key] || key;
}

export default function TeamDetailPage() {
  const params = useParams() as { teamId?: string };
  const teamId = params.teamId;
  const router = useRouter();

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/team`);
        const data = await res.json();

        const index = Number(teamId) - 1;
        const selectedTeam = data.teams?.[index];

        if (!selectedTeam) {
          alert("해당 팀 정보를 찾을 수 없습니다.");
          router.push("/");
          return;
        }

        setTeam(selectedTeam);
      } catch (err) {
        console.error(err);
        alert("팀 정보를 불러오는 중 오류가 발생했습니다.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        로딩 중...
      </div>
    );

  if (!team) return null;

  return (
    <div className="w-full max-w-[500px] mx-auto px-6">
      {/* 팀명 */}
      <div className="text-center m-8">
        <h1 className="text-3xl" style={{ fontFamily: 'OkDanDan', color: '#FF6F00' }}>{team.teamName}</h1>
      </div>

      {/* 멤버 리스트 */}
      <div className="flex flex-col  gap-6">
        {team.members.map((m: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 rounded-2xl border border-gray-300"
            style={{ backgroundColor: '#f7f7f7' }}
          >
            {/* 이미지 */}
            <div className="w-[130px] h-[130px] overflow-hidden shrink-0">
            <img
              src={m.image}
              alt={m.name}
              className="w-full h-full object-cover border border-gray-300"
            />
          </div>


            {/* 멤버 정보 */}
            <div className="flex flex-col justify-center">
              {/* 이름 + 리더 표시 */}
              <p className="text-2xl" style={{ fontFamily: 'OkDanDan' }}>
                {m.name} {m.leader && "⭐"}
              </p>

              {/* 나머지 답변 전체 출력 */}
              {Object.entries(m)
                .filter(([key]) => !["name", "image", "leader"].includes(key))
                .map(([key, value], idx) => (
                  <p key={idx} className="text-m">
                    {typeof value === "number" ? (
                      <>
                        <span>{convertLabel(key)}: </span>
                        {value}
                      </>
                    ) : (
                      // 문자열이면 그대로 출력
                      <>{String(value)}</>
                    )}
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* 처음 화면으로 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={() => router.push("/")}
          className="text-2xl border border-gray-300 rounded-full px-5 py-2 m-8 text-white hover:brightness-95"
          style={{ backgroundColor: '#FF6F00' }}
        >
          처음 화면으로
        </button>
      </div>
    </div>
  );
}
