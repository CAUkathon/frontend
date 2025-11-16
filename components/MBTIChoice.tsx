/**
 * Q3 전용 : MBTI 선택
 * 4개 카테고리에 각각 2개의 선택지
 */

interface MBTIState {
  EI?: string;
  NS?: string;
  FT?: string;
  PJ?: string;
  [key: string]: string | undefined;
}

interface Props {
  selected?: MBTIState;
  onSelect: (v: MBTIState) => void;
}

const MBTI_GROUPS = [
  { key: "EI", items: ["E", "I"] },
  { key: "NS", items: ["N", "S"] },
  { key: "FT", items: ["F", "T"] },
  { key: "PJ", items: ["P", "J"] },
];

export default function MBTIChoice({ selected = {}, onSelect }: Props) {
  const handleSelect = (groupKey: string, value: string) => {
    onSelect({
      ...selected,
      [groupKey]: value,
    });
  };

  return (
    <div className="space-y-4">
      {MBTI_GROUPS.map((group) => (
        <div key={group.key} className="flex gap-3">
          {group.items.map((item) => {
            const isSelected = selected[group.key] === item;

            return (
              <button
                key={item}
                onClick={() => handleSelect(group.key, item)}
                className={`flex-1 p-4 rounded-lg border-2 font-[MeetMe] text-xl transition
                  ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                `}
              >
                {item}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}