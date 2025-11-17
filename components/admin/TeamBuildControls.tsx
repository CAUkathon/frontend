/**
 * TeamBuildControls.tsx
 * - 총원, 팀 개수 입력 및 팀 빌딩 버튼 UI
 * - CounterInput과 팀 빌딩 버튼을 포함
 */

'use client';

import CounterInput from "./CounterInput";

interface TeamBuildControlsProps {
  totalMembers: number;
  setTotalMembers: (val: number) => void;
  teamCount: number;
  setTeamCount: (val: number) => void;
  hasUnbuiltMembers: boolean;
  answerCount: number;
  handleBuildTeams: () => void;
}

export default function TeamBuildControls({
  totalMembers,
  setTotalMembers,
  teamCount,
  setTeamCount,
  hasUnbuiltMembers,
  answerCount,
  handleBuildTeams
}: TeamBuildControlsProps) {
  const isButtonDisabled = answerCount !== totalMembers || teamCount > answerCount;

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-row items-center justify-between w-full max-w-[600px]">
        {/* 총원/팀개수 */}
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
  );
}