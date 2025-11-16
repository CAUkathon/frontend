/**
 * ImageChoice
 * - Q5, Q7 전용 이미지 선택형 질문 컴포넌트
 * - 2개의 이미지 중 1개 선택
 * - 선택 시 이미지가 filled로 바뀌고 클릭 시 active 효과 적용
 * 
 * Props:
 * - questionId: 질문 번호 (이미지 경로용)
 * - choices: 선택지 이름 배열
 * - selected: 현재 선택된 값
 * - onSelect: 선택 시 콜백
 */

interface Props {
  questionId: number;
  choices: string[];
  selected?: string;
  onSelect: (v: string) => void;
}

export default function ImageChoice({ questionId, choices, selected, onSelect }: Props) {
  return (
    <div className="flex justify-center gap-7">
      {choices.map((c) => {
        const isSelected = selected === c;

        const img = isSelected
          ? `/images/question-${questionId}/${c}-filled.png`
          : `/images/question-${questionId}/${c}-default.png`;

        return (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <img src={img} alt={c} className="h-28 object-contain" />
          </button>
        );
      })}
    </div>
  );
}
