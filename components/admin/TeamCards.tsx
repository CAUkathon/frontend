/**
 * TeamCards.tsx
 * - 팀별 카드 영역 렌더링
 * - activeTeam에 따라 전체 보기 또는 특정 팀만 표시
 * - AnswerCard 사용
 */

'use client';

import AnswerCard from "./AnswerCard";

interface TeamCardsProps {
  teams: any[];
  activeTeam: number;
  TEAM_COLORS: string[];
}

export default function TeamCards({ teams, activeTeam, TEAM_COLORS }: TeamCardsProps) {
  if (teams.length === 0) return null;

  const renderTeam = (team: any, tIdx: number) => {
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
  };

  if (activeTeam === 0) {
    return <>{teams.map(renderTeam)}</>;
  }

  const t = teams[activeTeam - 1];
  if (!t) return null;

  return renderTeam(t, activeTeam - 1);
}