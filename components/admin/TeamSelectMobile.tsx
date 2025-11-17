/**
 * TeamSelectMobile.tsx
 * - 모바일용 팀 선택 select UI
 */

'use client';

import React from "react";

interface TeamSelectMobileProps {
  teams: any[];
  activeTeam: number;
  setActiveTeam: (idx: number) => void;
}

export default function TeamSelectMobile({ teams, activeTeam, setActiveTeam }: TeamSelectMobileProps) {
  return (
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
  );
}