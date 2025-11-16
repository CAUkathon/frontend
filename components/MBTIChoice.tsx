/**
 * Q3 전용 : MBTI 선택
 * 4개 카테고리에 각각 2개의 선택지
 */

import { useState } from "react";

interface Props {
  selected?: string; // INTJ 같은 문자열
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

  const handleSelect = (groupIndex: number, value: string) => {
    const keys = ["EI", "NS", "FT", "PJ"] as const;
    const key = keys[groupIndex];

    const newState: MBTIState = {
      ...state,
      [key]: value,
    };

    setState(newState);

    // 네 자리 모두 선택되면 문자열로 완성
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
                  className={`flex-1 p-4 rounded-lg border-2 font-[MeetMe] text-xl transition
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