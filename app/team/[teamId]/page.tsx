"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

// key를 한국어 라벨로 바꿔주는 매핑 함수
function convertLabel(key: string) {
  const map: Record<string, string> = {
    mbti: "mbti",
    hobby: "취미/관심사",
    favoriteFood: "좋아하는 음식",
    wildLionAnswer: "야생의 사자를 만나면",
    drinkScore: "음주 점수",
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
    <div className="w-full max-w-[420px] mx-auto px-5 pb-20">
      {/* 팀명 */}
      <div className="text-center mt-8 mb-6">
        <h1 className="text-3xl font-extrabold">{team.teamName}</h1>
      </div>

      {/* 구분선 */}
      <div className="w-full h-[1px] bg-gray-300 mb-6"></div>

      {/* 멤버 리스트 */}
      <div className="flex flex-col gap-6">
        {team.members.map((m: any, idx: number) => (
          <div
            key={idx}
            className="flex gap-4 p-4 rounded-2xl bg-gray-100 shadow-sm"
          >
            {/* 이미지 */}
            <div className="w-[150px] h-[150px] bg-gray-300 overflow-hidden flex-shrink-0">
            <img
              src={m.image}
              alt={m.name}
              className="w-full h-full object-cover"
            />
          </div>


            {/* 멤버 정보 */}
            <div className="flex flex-col justify-center">
              {/* 이름 + 리더 표시 */}
              <p className="font-bold text-lg">
                {m.name} {m.leader && "⭐"}
              </p>

              {/* 나머지 답변 전체 출력 */}
              {Object.entries(m)
                .filter(([key]) => !["name", "image", "leader"].includes(key))
                .map(([key, value], idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    <span className="font-medium">
                      {convertLabel(key)}:
                    </span>{" "}
                    {String(value)}
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* 처음 화면으로 버튼 */}
      <button
        onClick={() => router.push("/")}
        className="mt-10 w-full py-3 text-lg rounded-xl text-white bg-[#FF6F00] hover:brightness-95 transition"
      >
        처음 화면으로
      </button>
    </div>
  );
}
