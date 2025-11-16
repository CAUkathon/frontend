/**
 * MBTIChoice
 * - Q3 전용 MBTI 선택형 질문
 * - 4개 카테고리(EI, NS, FT, PJ) 각각 2개 선택지
 * - 4자리 모두 선택되면 INTJ 같은 문자열로 완성하여 onSelect 호출
 * 
 * Props:
 * - selected: 현재 선택된 MBTI 문자열
 * - onSelect: 모든 선택 완료 시 호출되는 콜백
 */

import { useEffect, useState } from "react";

interface Props {
  selected?: string; // ex: "ENFP"
  onSelect: (v: string) => void;
}

type MBTIState = {
  EI: string | null;
  NS: string | null;
  FT: string | null;
  PJ: string | null;
};

const MBTI_GROUPS = [
  ["E", "I"],
  ["N", "S"],
  ["F", "T"],
  ["P", "J"],
];

export default function MBTIChoice({ selected, onSelect }: Props) {
  const [state, setState] = useState<MBTIState>({
    EI: null,
    NS: null,
    FT: null,
    PJ: null,
  });

  // selected 값이 존재할 경우 → state 복원 (뒤로가기 대비)
  useEffect(() => {
    if (!selected) return;

    const chars = selected.split(""); // ['E'], ['E','N'], ['E','N','F'], ['E','N','F','P']

    setState({
      EI: chars[0] ?? null,
      NS: chars[1] ?? null,
      FT: chars[2] ?? null,
      PJ: chars[3] ?? null,
    });
  }, [selected]);


  // 특정 그룹 선택 시 상태 업데이트
  const handleSelect = (groupIndex: number, value: string) => {
    const keys = ["EI", "NS", "FT", "PJ"] as const;
    const key = keys[groupIndex];

    const newState: MBTIState = {
      ...state,
      [key]: value,
    };

    setState(newState);

    // 4자리 모두 선택되었을 때만 상위로 전달
    if (Object.values(newState).every((v) => v !== null)) {
      const result = Object.values(newState).join("");
      onSelect(result);
    }
  };

  return (
    <div className="space-y-4">
      {MBTI_GROUPS.map((pair, index) => {
        const keys = ["EI", "NS", "FT", "PJ"] as const;
        const active = state[keys[index]];

        return (
          <div key={index} className="flex gap-3">
            {pair.map((item) => {
              const isSelected = active === item;

              return (
                <button
                  key={item}
                  onClick={() => handleSelect(index, item)}
                  className={`flex-1 rounded-lg border-2 font-[MeetMe] text-2xl transition
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  {item}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}