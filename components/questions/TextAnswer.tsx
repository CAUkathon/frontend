/**
 * TextAnswer
 * - 주관식 입력 컴포넌트 (Q4, Q6)
 * - value 변경 시 onChange 호출
 * 
 * Props:
 * - value: 현재 입력 값
 * - onChange: 값 변경 시 호출
 */

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function TextAnswer({ value, onChange }: Props) {
  return (
    <div className="flex justify-center">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="아기사자가 궁금해..."
          className="w-70 p-3 rounded-xl border border-gray-300 font-[Pretendard]"
        />
    </div>
  );
}