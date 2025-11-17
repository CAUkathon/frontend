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

  /* 개별 삭제 */
  const handleDeleteAnswer = async () => {
    if (!deleteTargetId) return;

    try {
      const res = await deleteMember(deleteTargetId);

      if (!res.ok) {
        alert("삭제 실패");
        return;
      }

      // UI 반영
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
    } catch {
      alert("팀 빌딩 중 오류가 발생했습니다.");
    }
  };

  /** DELETE /team */
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

  // 최초 실행
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
      {/* ===== 개별 삭제 모달 ===== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-72 text-center">
            <h2 className="text-lg font-semibold mb-3">정말 삭제할까요?</h2>
            <p className="text-sm text-gray-600 mb-5">
              선택한 사용자의 응답이 완전히 삭제됩니다.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                취소
              </button>

              <button
                onClick={handleDeleteAnswer}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:brightness-95"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== RESET MODAL ===== */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-72 text-center">
            <h2 className="text-lg font-semibold mb-3">정말 리셋할까요?</h2>
            <p className="text-sm text-gray-600 mb-5">
              모든 팀 데이터가 삭제됩니다.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                취소
              </button>
              <button
                onClick={confirmResetTeams}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:brightness-95"
              >
                리셋
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PAGE ===== */}
      <div className="w-full min-h-screen flex flex-col items-center mt-20">

        {/* INPUT UI */}
        <div className="flex flex-col gap-4 w-full max-w-md px-4">
          <CounterInput
            label="총원"
            value={totalMembers}
            onChange={setTotalMembers}
            min={answerCount}
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
              className={`rounded-2xl shadow-md text-lg px-8 py-4 transition ${
                isButtonDisabled || !hasUnbuiltMembers
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#FF6F00] text-white hover:brightness-95"
              }`}
            >
              팀 빌딩 시작
            </button>
          </div>

          <p className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-md font-medium text-center">
            응답: {answerCount} / {totalMembers}
          </p>
        </div>

        {/* TEAM UI */}
        {teams.length > 0 && !hasUnbuiltMembers ? (
          <div className="w-full max-w-md mt-10 flex flex-col gap-6 px-4 mb-24">
            {/* 모바일 */}
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

            {/* PC 탭 */}
            <div className="hidden md:flex overflow-x-auto whitespace-nowrap gap-2 mb-5 px-2">
              <button
                onClick={() => setActiveTeam(0)}
                className="px-3 py-1.5 rounded-full border text-sm shrink-0 transition"
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
                    className="px-3 py-1.5 rounded-full border text-sm shrink-0 transition hover:opacity-80"
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

            {/* 전체 보기 */}
            {activeTeam === 0 &&
              teams.map((team, tIdx) => {
                const color = TEAM_COLORS[tIdx % TEAM_COLORS.length];
                return (
                  <div
                    key={tIdx}
                    className="p-4 rounded-xl shadow bg-white"
                    style={{ borderLeft: `8px solid ${color}` }}
                  >
                    <h2 className="font-bold text-lg mb-3" style={{ color }}>
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

            {/* 특정 팀 */}
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
                    color: TEAM_COLORS[(activeTeam - 1) % TEAM_COLORS.length],
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
          /* ===== 팀 빌딩 전 ===== */
          <div className="w-full max-w-md mt-10 flex flex-col gap-4 px-4 mb-24">
            {results.map((item) => (
              <div key={item.memberId} className="relative">

                <AnswerCard
                  name={item.memberName}
                  answers={item.answers}
                />

                {/* 삭제 버튼 */}
                <button
                  onClick={() => {
                    setDeleteTargetId(item.memberId);
                    setShowDeleteModal(true);
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:scale-110 transition"
                >
                  <Trash2 size={20} strokeWidth={2.2} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* RESET 버튼 */}
        {!hasUnbuiltMembers && (
          <div className="w-full flex justify-center mb-10">
            <button
              onClick={() => setShowResetModal(true)}
              className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:brightness-95 font-[Pretendard]"
            >
              전체 리셋
            </button>
          </div>
        )}
      </div>
    </>
  );
}
