/**
 * ImageScale
 * - Q1, Q2 전용 척도형 질문 컴포넌트
 * - 10개의 버튼을 5개씩 2줄로 배치
 * - 각 버튼 클릭 시 선택/취소 가능
 * - 선택된 값은 배열로 관리
 * 
 * Props:
 * - question: 질문 정보 (questionId 사용)
 * - selected: 선택된 값 배열
 * - onSelect: 선택 시 콜백 (string[] 전달)
 */

import { Question } from '@/lib/types';

interface Props {
  question: Question;
  selected?: string[]; // 여러 개 선택 가능
  onSelect: (values: string[]) => void;
}

export default function ImageScale({ question, selected = [], onSelect }: Props) {
  const num = question.questionId;
  const perRow = 5; // 5개씩
  const totalRows = 2; // 2줄

  // 버튼 클릭 시 선택/취소
  const handleClick = (value: string) => {
    if (selected.includes(value)) {
      onSelect(selected.filter(v => v !== value)); // 이미 선택된 버튼이면 취소
    } else {
      onSelect([...selected, value]); // 새로 선택 추가
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-2">
        <p className="text-lg" style={{ color: "#FF6F00" }}>
          ※ 해당하는 만큼 눌러주세요! (1개 이상) ※
        </p>
      </div>

      {Array.from({ length: totalRows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-3 mb-2">
          {Array.from({ length: perRow }, (_, colIndex) => {
            const btnNumber = rowIndex * perRow + colIndex + 1;
            const isSelected = selected.includes(String(btnNumber));
            const img = isSelected
              ? `/images/question-${num}/filled.png`
              : `/images/question-${num}/default.png`;

            return (
              <button
                key={btnNumber}
                onClick={() => handleClick(String(btnNumber))}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <img src={img} />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}