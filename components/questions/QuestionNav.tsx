/**
 * QuestionNav
 * - 이전/다음/제출 버튼을 포함한 질문 네비게이션
 * - 마지막 질문 시 '다음' 버튼을 '제출' 버튼으로 변경
 * 
 * Props:
 * - currentIndex: 현재 질문 인덱스
 * - total: 전체 질문 개수
 * - onPrevious: 이전 버튼 클릭 시
 * - onNext: 다음 버튼 클릭 시
 * - onSubmit: 제출 버튼 클릭 시
 */

interface QuestionNavProps {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function QuestionNav({
  currentIndex,
  total,
  onPrevious,
  onNext,
  onSubmit,
}: QuestionNavProps) {
  const isLast = currentIndex === total - 1;

  return (
    <div className="w-full bg-white pb-4">
      <div className="w-full max-w-[375px] mx-auto">

        <div className="flex gap-3 justify-center">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={`w-22 py-3 rounded-full text-2xl
              ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400 border-gray-200'
                  : 'bg-gray-300 text-black hover:brightness-95'
              }`}
          >
            이전
          </button>

          {isLast ? (
            <button
              onClick={onSubmit}
              className="w-22 py-3 rounded-full bg-blue-500 text-white text-2xl hover:brightness-95"
            >
              제출
            </button>
          ) : (
            <button
              onClick={onNext}
              className="w-22 py-3 rounded-full text-2xl text-white hover:brightness-95"
              style={{ backgroundColor: '#FF6F00' }}
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
}