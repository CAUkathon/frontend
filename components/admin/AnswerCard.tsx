// components/admin/AnswerCard.tsx

interface AnswerCardProps {
  name: string;
  answers: string[] | Record<string, string> | undefined | null;  
  isLeader?: boolean;
  teamColor?: string;
}

export default function AnswerCard({ name, answers, isLeader, teamColor }: AnswerCardProps) {
  
  const safeAnswers = answers ?? {};

  const entries: [string, string][] = Array.isArray(safeAnswers)
    ? safeAnswers.map((item) => {
        if (item.includes(":")) {
          const [label, value] = item.split(":").map((s) => s.trim());
          return [label, value];
        }
        return ["답변", item];
      })
    : Object.entries(safeAnswers);  

  return (
    <div
      className="w-full rounded-2xl p-5 border border-gray-300"
      style={{
        border: teamColor ? `2px solid ${teamColor}` : "1px solid #ddd",
        backgroundColor:
          isLeader && teamColor ? `${teamColor}20` : "#f7f7f7",
      }}
    >
      {/* 이름 */}
      <h3
        className="text-2xl mb-3 text-center"
        style={{ color: teamColor ?? "#333", fontFamily: 'OkDanDan' }}
      >
        {name} {isLeader && "⭐"}
      </h3>

      {/* 질문/답변 리스트 */}
      <div className="flex flex-col gap-1 text-lg">
        {entries.length > 0 ? (
          entries.map(([label, value], index) => (
            <div key={index} className="flex gap-2">
              <span className="whitespace-nowrap">{label}:</span>
              <span>{value}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-center">답변 없음</p> 
        )}
      </div>
    </div>
  );
}
