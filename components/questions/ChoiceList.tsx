/**
 * ChoiceList
 * - 일반 선택형 질문 컴포넌트
 * - 여러 개 선택이 아닌 단일 선택
 * - 선택된 버튼은 색상 변화
 * 
 * Props:
 * - choices: 선택지 배열
 * - selected: 현재 선택된 값
 * - onSelect: 선택 시 콜백
 */

interface Props {
  choices: string[];
  selected?: string;
  onSelect: (v: string) => void;
}

export default function ChoiceList({ choices, selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {choices.map(choice => (
        <button
          key={choice}
          onClick={() => onSelect(choice)}
          className={`w-full p-3 rounded-lg border-2 font-[MeetMe] text-xl ${
            selected === choice
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
