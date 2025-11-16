"use client";

import { useEffect, useState } from "react";
import CounterInput from "@/components/admin/CounterInput";
import AnswerCard from "@/components/admin/AnswerCard";
import { API_BASE_URL } from "@/lib/api";

export default function AdultAdminPage() {
  const [totalMembers, setTotalMembers] = useState<number>(30);
  const [teamCount, setTeamCount] = useState<number>(5);

  const [answerCount, setAnswerCount] = useState<number>(0);
  const [results, setResults] = useState<any[]>([]);

  const [teams, setTeams] = useState<any[]>([]);
  const [hasUnbuiltMembers, setHasUnbuiltMembers] = useState<boolean>(true);

  const [activeTeam, setActiveTeam] = useState<number>(0); // 0 = 전체 보기

  const TEAM_COLORS = [
    "#FF6F00",
    "#007AFF",
    "#34C759",
    "#AF52DE",
    "#FF3B30",
    "#5AC8FA",
  ];

  /** GET /adult */
  const fetchAdultResults = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/adult`);
      const data = await res.json();

      setAnswerCount(data.memberCount ?? 0);
      setResults(data.results ?? []);
    } catch {
      console.error("응답 조회 실패");
    }
  };

  /** GET /team */
  const fetchTeamInfo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/team`);
      const data = await res.json();

      setHasUnbuiltMembers(data.hasUnbuiltMembers);

      // adult answers 기반 매핑
      const answerMap = new Map(
        results.map((r) => [r.memberName, r.answers])
      );


      const mergedTeams = (data.teams ?? []).map((team) => ({
        ...team,
        members: team.members.map((m) => ({
          ...m,
          answers: answerMap.get(m.name) ?? {}, // answers 없으면 빈 객체
        })),
      }));

      setTeams(mergedTeams);
    } catch {
      console.error("팀 정보 조회 실패");
    }
  };

  /** POST /team */
  const handleBuildTeams = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalMembers,
          teamCount,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(err?.message ?? "팀 빌딩 실패");
        return;
      }

      alert("팀 빌딩이 완료되었습니다!");
      fetchTeamInfo();
    } catch (error) {
      console.error("팀 빌딩 실패:", error);
      alert("팀 빌딩 중 오류가 발생했습니다.");
    }
  };

  // 최초 실행
  useEffect(() => {
    fetchAdultResults();
  }, []);

  useEffect(() => {
    fetchTeamInfo();
  }, [results]);

  // 응답 수(answerCount)를 totalMembers로 자동 동기화
  useEffect(() => {
    if (answerCount > 0) {
      setTotalMembers(answerCount);
    }
  }, [answerCount]);

  const isButtonDisabled =
    answerCount !== totalMembers || teamCount > answerCount;

  return (
    <div className="w-full min-h-screen flex flex-col items-center mt-20">
      
      {/* ===== 상단 입력 UI ===== */}
      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <CounterInput
            label="총원"
            value={totalMembers}
            onChange={setTotalMembers}
            min={1}
            disabled={!hasUnbuiltMembers}
        />


        <div className="flex items-center justify-between gap-4">
          <CounterInput
            label="팀 개수"
            value={teamCount}
            onChange={setTeamCount}
            min={1}
            disabled={!hasUnbuiltMembers}
          />

          <button
            onClick={handleBuildTeams}
            disabled={isButtonDisabled || !hasUnbuiltMembers}
            className={`
              rounded-2xl shadow-md text-lg px-8 py-4
              transition
              ${
                isButtonDisabled || !hasUnbuiltMembers
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#FF6F00] text-white hover:brightness-95"
              }
            `}
          >
            팀 빌딩 시작
          </button>
        </div>

        {/* 응답 현황 */}
        <p className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-md font-medium text-center">
          응답: {answerCount} / {totalMembers}
        </p>
      </div>

      {/* ===== 팀 빌딩 후 UI ===== */}
      {teams.length > 0 && !hasUnbuiltMembers ? (
        <div className="w-full max-w-md mt-10 flex flex-col gap-6 px-4 mb-24">

          {/* 모바일 드롭다운 */}
          <div className="md:hidden mb-5">
            <select
              value={activeTeam}
              onChange={(e) => setActiveTeam(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded-lg shadow-sm"
            >
              <option value={0}>전체 보기</option>
              {teams.map((team, idx) => (
                <option key={idx} value={idx + 1}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>

          {/* PC 탭 (가로 스크롤 적용됨) */}
            <div className="hidden md:flex overflow-x-auto whitespace-nowrap gap-2 mb-5 px-2">

            {/* 전체 버튼 */}
            <button
                onClick={() => setActiveTeam(0)}
                className="px-3 py-1.5 rounded-full border text-sm transition shrink-0"
                style={{
                backgroundColor: activeTeam === 0 ? "#6B7280" : "white",
                borderColor: "#6B7280",
                color: activeTeam === 0 ? "white" : "#6B7280",
                }}
            >
                전체
            </button>

            {/* 팀 버튼들 */}
            {teams.map((team, idx) => {
                const color = TEAM_COLORS[idx % TEAM_COLORS.length];
                const isActive = activeTeam === idx + 1;

                return (
                <button
                    key={idx}
                    onClick={() => setActiveTeam(idx + 1)}
                    className="px-3 py-1.5 rounded-full border text-sm transition shrink-0 hover:opacity-80"
                    style={{
                    borderColor: color,
                    backgroundColor: isActive ? color : "white",
                    color: isActive ? "white" : color,
                    }}
                >
                    {team.teamName}
                </button>
                );
            })}

            </div>


          {/* ===== 전체 보기 ===== */}
          {activeTeam === 0 && (
            <>
              {teams.map((team, tIdx) => {
                const color = TEAM_COLORS[tIdx % TEAM_COLORS.length];

                return (
                  <div
                    key={tIdx}
                    className="p-4 rounded-xl shadow bg-white"
                    style={{ borderLeft: `8px solid ${color}` }}
                  >
                    <h2
                      className="font-bold text-lg mb-3"
                      style={{ color }}
                    >
                      {team.teamName}
                    </h2>

                    <div className="flex flex-col gap-2">
                      {team.members.map((m: any, idx: number) => (
                        <AnswerCard
                          key={idx}
                          name={m.name}
                          answers={m.answers}  
                          isLeader={m.leader}
                          teamColor={color}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* ===== 특정 팀 보기 ===== */}
          {activeTeam !== 0 && teams[activeTeam - 1] && (
            <div
              className="p-4 rounded-xl shadow bg-white"
              style={{
                borderLeft: `8px solid ${
                  TEAM_COLORS[(activeTeam - 1) % TEAM_COLORS.length]
                }`,
              }}
            >
              <h2
                className="font-bold text-lg mb-3"
                style={{
                  color:
                    TEAM_COLORS[(activeTeam - 1) % TEAM_COLORS.length],
                }}
              >
                {teams[activeTeam - 1].teamName}
              </h2>

              <div className="flex flex-col gap-2">
                {teams[activeTeam - 1].members.map((m: any, idx: number) => (
                  <AnswerCard
                    key={idx}
                    name={m.name}
                    answers={m.answers}
                    isLeader={m.leader}
                    teamColor={
                      TEAM_COLORS[(activeTeam - 1) % TEAM_COLORS.length]
                    }
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (

        /* ===== 팀 빌딩 전: 기존 응답 카드 ===== */
        <div className="w-full max-w-md mt-10 flex flex-col gap-4 px-4 mb-24">
          {results.map((item) => (
            <AnswerCard
              key={item.memberId}
              name={item.memberName}
              answers={item.answers}   
            />
          ))}
        </div>
      )}
    </div>
  );
}
