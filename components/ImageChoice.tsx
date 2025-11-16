/**
 * Q5, Q7 전용 : 이미지 2개 중 1개 선택
 */

interface Props {
  questionId: number;
  choices: string[];
  selected?: string;
  onSelect: (v: string) => void;
}

export default function ImageChoice({ questionId, choices, selected, onSelect }: Props) {
  return (
    <div className="flex justify-center gap-6">
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
            <img src={img} alt={c} className="w-24 h-24 object-contain" />
          </button>
        );
      })}
    </div>
  );
}
