/**
 * QuestionsPage
 * - 질문 페이지 전체 레이아웃
 * - ProgressRate(상단 진행률), 질문 내용, 답변 컴포넌트, QuestionNav(이전/다음 버튼) 포함
 * - API에서 질문 데이터를 불러오고, 답변을 상태에 저장
 * - 제출 시 answers를 가공해서 서버에 전송
 * - 제출 버튼 클릭 시 모든 문항에 다 응답했는지 검사
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import { getQuestions, joinUser } from '@/lib/api';
import { Question } from '@/lib/types';
import ProgressRate from '@/components/questions/ProgressRate';
import QuestionNav from '@/components/questions/QuestionNav';
import Answer from '@/components/questions/Answer';
import Loading from '@/components/common/Loading';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 질문 데이터 fetch
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (err) {
        console.error(err);
        alert('질문을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <Loading />;
  if (!questions.length) return <div className="text-center mt-10">질문이 없습니다.</div>;

  const currentQuestion = questions[currentIndex];

  // 답변 상태 업데이트
  const handleAnswer = (value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.questionId]: value }));
  };

  // 모든 문항 답변 여부 확인
  const allAnswered = () => {
    for (const q of questions) {
      const ans = answers[q.questionId];
      if (!ans || (Array.isArray(ans) && ans.length === 0)) {
        alert('모든 문항에 답변해주세요!');
        return false;
      }
    }
    return true;
  };

  // 서버 제출
  const submitToServer = async () => {
    if (!allAnswered()) return;

    const signup = JSON.parse(Cookies.get("signup") || "{}");

    // 척도형 답변 가공
    const payloadAnswers: Record<string, string> = {};
    Object.entries(answers).forEach(([key, val]) => {
      payloadAnswers[key] = Array.isArray(val) ? String(val.length) : val;
    });

    const payload = {
      name: signup.name,
      password: signup.password,
      gender: signup.gender,
      answers: payloadAnswers,
    };

    try {
      const data = await joinUser(payload);
      router.push(`/mypage/${data.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || '제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <div
        className="w-full max-w-[375px] flex flex-col justify-around items-center"
        style={{ height: 'calc(100vh - var(--header-height))' }}
      >
        {/* 진행률 */}
        <ProgressRate current={currentIndex + 1} total={questions.length} />

        {/* 질문 영역 */}
        <div className="relative flex justify-center">
          <img src="/images/laptop.png" className="w-[320px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-[24px] text-black">{currentQuestion.content}</h2>
          </div>
        </div>

        {/* 답변 컴포넌트 */}
        <div className="w-[320px]">
          <Answer
            question={currentQuestion}
            answer={answers[currentQuestion.questionId]}
            onAnswer={handleAnswer}
          />
        </div>

        {/* 이전/다음/제출 버튼 */}
        <QuestionNav
          currentIndex={currentIndex}
          total={questions.length}
          onPrevious={() => setCurrentIndex(i => i - 1)}
          onNext={() => setCurrentIndex(i => i + 1)}
          onSubmit={submitToServer}
        />
      </div>
    </div>
  );
}