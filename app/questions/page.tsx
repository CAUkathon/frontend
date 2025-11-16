'use client';

import { useEffect, useState } from 'react';
import { getQuestions } from '@/lib/api';
import { Question } from '@/lib/types';
import ProgressRate from '@/components/ProgressRate';
import QuestionNav from '@/components/QuestionNav';
import Answer from '@/components/Answer';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const data = await getQuestions();
      setQuestions(data);
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  if (loading)
    return <div className="flex justify-center items-center h-screen text-lg">로딩 중...</div>;

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.questionId]: value,
    }));
  };

  const submitToServer = async () => {
    const signup = JSON.parse(sessionStorage.getItem('signup') || '{}');

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

    console.log("최종 제출 payload:", payload);

    try {
      const res = await fetch("https://cauhackathon-team2.p-e.kr/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("응답:", data);
      alert(`제출 완료: ${JSON.stringify(data)}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || '제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <div
        className="w-full max-w-[375px] flex flex-col justify-between"
        style={{ height: 'calc(100vh - var(--header-height))' }}
      >
        <ProgressRate current={currentIndex + 1} total={questions.length} />

        <div className="relative flex justify-center">
          <img src="/images/laptop.png" className="w-[320px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-center">
            <h2 className="text-xl font-[MeetMe] text-black">
              {currentQuestion.content}
            </h2>
          </div>
        </div>

        <div className="px-5 py-2">
          <Answer
            question={currentQuestion}
            answer={answers[currentQuestion.questionId]}
            onAnswer={handleAnswer}
          />
        </div>

        <QuestionNav
          currentIndex={currentIndex}
          total={questions.length}
          onPrevious={() => setCurrentIndex((i) => i - 1)}
          onNext={() => setCurrentIndex((i) => i + 1)}
          onSubmit={submitToServer}
        />
      </div>
    </div>
  );
}