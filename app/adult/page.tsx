"use client";

import { useEffect, useState } from "react";
import CounterInput from "@/components/admin/CounterInput";
import AnswerCard from "@/components/admin/AnswerCard";
import { API_BASE_URL } from "@/lib/api";
import { Trash2 } from "lucide-react";

/* DELETE /member/{id} - 개별 응답 삭제 API */
async function deleteMember(id: number) {
  return fetch(`${API_BASE_URL}/member/${id}`, {
    method: "DELETE",
  });
}

/* DELETE /team API */
async function deleteTeams() {
  const token = localStorage.getItem("token");

  return fetch(`${API_BASE_URL}/team`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

export default function AdultAdminPage() {
  const [totalMembers, setTotalMembers] = useState<number>(30);
  const [teamCount, setTeamCount] = useState<number>(5);

  const [answerCount, setAnswerCount] = useState<number>(0);
  const [results, setResults] = useState<any[]>([]);

  const [teams, setTeams] = useState<any[]>([]);
  const [hasUnbuiltMembers, setHasUnbuiltMembers] = useState<boolean>(true);

  const [activeTeam, setActiveTeam] = useState<number>(0);

  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const TEAM_COLORS = [
    "#FF6F00",
    "#007AFF",
    "#34C759",
    "#AF52DE",
    "#FF3B30",
    "#5AC8FA",
  ];

  const handleDeleteAnswer = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await deleteMember(deleteTargetId);
      if (!res.ok) {
        alert("삭제 실패");
        return;
      }
      setResults((prev) => prev.filter((r) => r.memberId !== deleteTargetId));
      setAnswerCount((prev) => prev - 1);
      setTotalMembers((prev) => prev - 1);
      alert("삭제되었습니다.");
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

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

  const fetchTeamInfo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/team`);
      const data = await res.json();
      setHasUnbuiltMembers(data.hasUnbuiltMembers);

      const answerMap = new Map(results.map((r) => [r.memberName, r.answers]));
      const mergedTeams = (data.teams ?? []).map((team: any) => ({
        ...team,
        members: team.members.map((m: any) => ({
          ...m,
          answers: answerMap.get(m.name) ?? {},
        })),
      }));

      setTeams(mergedTeams);
    } catch {
      console.error("팀 정보 조회 실패");
    }
  };

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
    } catch {
      alert("팀 빌딩 중 오류가 발생했습니다.");
    }
  };

  const confirmResetTeams = async () => {
    setShowResetModal(false);
    try {
      const res = await deleteTeams();
      if (!res.ok) {
        alert("팀 삭제 실패");
        return;
      }

      alert("팀 데이터 초기화 완료!");
      setTeams([]);
      setHasUnbuiltMembers(true);
      setActiveTeam(0);
      fetchAdultResults();
    } catch {
      alert("초기화 중 문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchAdultResults();
  }, []);

  useEffect(() => {
    fetchTeamInfo();
  }, [results]);

  useEffect(() => {
    if (answerCount > 0) {
      setTotalMembers(answerCount);
    }
  }, [answerCount]);

  const isButtonDisabled =
    answerCount !== totalMembers || teamCount > answerCount;

  return (
    <>
      {/* 개별 삭제 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-72 text-center">
            <h2 className="text-xl mb-3">정말 삭제할까요?</h2>
            <p className="text-gray-600 mb-5">
              선택한 사용자의 응답이 완전히 삭제됩니다.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAnswer}
                className="px-4 py-2 rounded-full bg-red-500 text-white hover:brightness-95"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-72 text-center">
            <h2 className="text-xl mb-3">정말 리셋할까요?</h2>
            <p className="text-gray-600 mb-5">
              모든 팀 데이터가 삭제됩니다.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                취소
              </button>
              <button
                onClick={confirmResetTeams}
                className="px-4 py-2 rounded-full bg-red-500 text-white hover:brightness-95"
              >
                리셋
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE */}
      <div className="w-full max-w-[375px] md:max-w-[1000px] flex flex-col items-center mt-3 px-6">

        {/* INPUT UI: 총원/팀개수 + 버튼 */}
        <div className="w-full flex justify-center">
          <div className="flex flex-row items-center justify-between w-full max-w-[600px]">
            {/* 총원/팀개수 col */}
            <div className="flex flex-col gap-2">
              <CounterInput
                label="총원"
                value={totalMembers}
                onChange={setTotalMembers}
                min={answerCount}
                disabled={!hasUnbuiltMembers}
              />
              <CounterInput
                label="팀 개수"
                value={teamCount}
                onChange={setTeamCount}
                min={1}
                disabled={!hasUnbuiltMembers}
              />
            </div>

    {/* 팀 빌딩 버튼 */}
    <div className="mt-0">
      <button
        onClick={handleBuildTeams}
        disabled={isButtonDisabled || !hasUnbuiltMembers}
        className={`rounded-3xl text-lg p-4 transition w-full md:w-auto border border-gray-300 ${
          isButtonDisabled || !hasUnbuiltMembers
            ? "bg-gray-300 text-gray-500"
            : "bg-[#FF6F00] text-white hover:brightness-95"
        }`}
      >
        팀 빌딩 시작
      </button>
    </div>
  </div>
</div>

        {/* 응답 정보 */}
        <p className="text-m bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-center w-full md:w-[600px] mb-4 mt-3">
          응답: {answerCount} / {totalMembers}
        </p>

        {/* TEAM UI */}
        {teams.length > 0 && !hasUnbuiltMembers ? (
          <div className="w-full flex flex-col gap-6 mb-16">

            {/* 모바일 select */}
            <div className="md:hidden flex justify-end">
              <select
                value={activeTeam}
                onChange={(e) => setActiveTeam(Number(e.target.value))}
                className="h-[35px] border border-gray-300 rounded-full px-3"
              >
                <option value={0}>전체 보기</option>
                {teams.map((team, idx) => (
                  <option key={idx} value={idx + 1}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </div>

            {/* PC 탭 */}
            <div className="hidden md:flex overflow-x-auto justify-around hide-scrollbar">
              <button
                onClick={() => setActiveTeam(0)}
                className="px-4 py-1 rounded-full border transition"
                style={{
                  backgroundColor: activeTeam === 0 ? "#6B7280" : "white",
                  borderColor: "#6B7280",
                  color: activeTeam === 0 ? "white" : "#6B7280",
                }}
              >
                전체
              </button>

              {teams.map((team, idx) => {
                const color = TEAM_COLORS[idx % TEAM_COLORS.length];
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTeam(idx + 1)}
                    className="px-4 py-1 rounded-full border transition hover:opacity-80"
                    style={{
                      borderColor: color,
                      backgroundColor: activeTeam === idx + 1 ? color : "white",
                      color: activeTeam === idx + 1 ? "white" : color,
                    }}
                  >
                    {team.teamName}
                  </button>
                );
              })}
            </div>

            {/* 카드 영역 */}
            {activeTeam === 0 &&
              teams.map((team, tIdx) => {
                const color = TEAM_COLORS[tIdx % TEAM_COLORS.length];
                return (
                  <div
                    key={tIdx}
                    className="p-4 rounded-xl bg-white"
                    style={{ borderLeft: `8px solid ${color}` }}
                  >
                    <h2 className="text-xl mb-3" style={{ color, fontFamily: 'OkDanDan' }}>
                      {team.teamName}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* 특정 팀 */}
            {activeTeam !== 0 && teams[activeTeam - 1] && (
              <div
                className="p-4 rounded-xl bg-white"
                style={{
                  borderLeft: `8px solid ${
                    TEAM_COLORS[(activeTeam - 1) % TEAM_COLORS.length]
                  }`,
                }}
              >
                <h2
                  className="font-bold text-xl mb-3"
                  style={{
                    color: TEAM_COLORS[(activeTeam - 1) % TEAM_COLORS.length],
                    fontFamily: 'OkDanDan'
                  }}
                >
                  {teams[activeTeam - 1].teamName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="w-full flex flex-col gap-4 mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((item) => (
                <div key={item.memberId} className="relative">
                  <AnswerCard
                    name={item.memberName}
                    answers={item.answers}
                  />
                  <button
                    onClick={() => {
                      setDeleteTargetId(item.memberId);
                      setShowDeleteModal(true);
                    }}
                    className="absolute top-4 right-4 text-red-500 hover:scale-110 transition"
                  >
                    <Trash2 size={20} strokeWidth={2.2} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESET 버튼 */}
        {!hasUnbuiltMembers && (
          <div className="w-full flex justify-center mb-3">
            <button
              onClick={() => setShowResetModal(true)}
              className="text-sm bg-red-500 border border-gray-300 text-white px-4 py-2 rounded-full hover:brightness-95"
            >
              전체 리셋
            </button>
          </div>
        )}
      </div>
    </>
  );
}