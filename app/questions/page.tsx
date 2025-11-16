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
import { getQuestions, joinUser } from '@/lib/api';
import { Question } from '@/lib/types';
import ProgressRate from '@/components/questions/ProgressRate';
import QuestionNav from '@/components/questions/QuestionNav';
import Answer from '@/components/questions/Answer';
import { useRouter } from 'next/navigation';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);	// 질문 목록
  const [currentIndex, setCurrentIndex] = useState(0);	// 현재 질문 인덱스
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});	// 응답 저장
  const [loading, setLoading] = useState(true);	// 로딩 상태
  const router = useRouter();

  // 페이지 로드 시 질문 데이터 불러오기 (fetch)
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

  // 로딩 화면
  if (loading) return <div className="flex justify-center items-center h-screen text-lg font-[MeetMe]">로딩 중...</div>;

  const currentQuestion = questions[currentIndex];	// 현재 질문

  const handleAnswer = (value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.questionId]: value }));
  };

  // 모든 문항 답변 완료? 검증
  const allAnswered = () => {
	for (const q of questions) {
		const ans = answers[q.questionId];

		if (!ans || (Array.isArray(ans) && ans.length === 0)) {
			alert(`모든 문항에 답변해주세요!`);
			return false;
		}
	}

	return true;
  }

  // 응답 제출
  const submitToServer = async () => {
	// 유효성 검사
	if (!allAnswered()) return;

	// 회원 가입 시 저장한 정보 불러오기
    const signup = JSON.parse(sessionStorage.getItem('signup') || '{}');

	// 응답 가공 - 척도형: 선택 개수로 변환
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

    console.log('제출한 내용:', payload);

    try {
      const data = await joinUser(payload);
      console.log('서버 응답:', data);

	  // 제출 성공시 결과 페이지로 이동
	  router.push ('/my');
    } catch (err: any) {
      console.error(err);
      alert(err.message || '제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <div className="w-full max-w-[375px] flex flex-col justify-between" style={{ height: 'calc(100vh - var(--header-height))' }}>

		{/* 진행률 표시 바 */}
        <ProgressRate current={currentIndex + 1} total={questions.length} />

		{/* 질문 영역 (laptop 이미지 + 질문 텍스트) */}
        <div className="relative flex justify-center">
          <img src="/images/laptop.png" className="w-[320px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-center">
            <h2 className="text-xl font-[MeetMe] text-black">{currentQuestion.content}</h2>
          </div>
        </div>

		{/* 응답 영역 컴포넌트 */}
        <div className="px-5 py-2">
          <Answer question={currentQuestion} answer={answers[currentQuestion.questionId]} onAnswer={handleAnswer} />
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