/**
 * ProgressRate
 * - 질문 진행률 표시 컴포넌트
 * - 상단 바 형태, 퍼센트에 따라 너비 변동
 * 
 * Props:
 * - current: 현재 질문 번호
 * - total: 전체 질문 개수
 */

interface ProgressRateProps {
  current: number;
  total: number;
}

export default function ProgressRate({ current, total }: ProgressRateProps) {
  const percent = (current / total) * 100;

  return (
    <div className="w-full bg-white p-6">
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="h-2 rounded-full" style={{ backgroundColor: '#FF6F00', width: `${percent}%`, transition: 'width 0.3s' }}
        />
      </div>
    </div>
  );
}
