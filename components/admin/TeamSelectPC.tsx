/**
 * TeamSelectPC.tsx
 * - PC용 팀 선택 버튼 UI (전체 + Team 1 + Team 2 +...)
 * - activeTeam, 팀 색상, 버튼 클릭 이벤트 처리
 */

'use client';

interface TeamSelectPCProps {
  teams: any[];
  TEAM_COLORS: string[];
  activeTeam: number;
  setActiveTeam: (idx: number) => void;
}

export default function TeamSelectPC({ teams, TEAM_COLORS, activeTeam, setActiveTeam }: TeamSelectPCProps) {
  return (
    <div className="hidden md:flex overflow-x-auto hide-scrollbar gap-4">
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
  );
}