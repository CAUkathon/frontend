/**
 * Answer
 * - 질문 타입에 따라 적절한 답변 컴포넌트 선택
 * - 척도형(Q1~Q2), MBTI(Q3), 이미지 선택(Q5, Q7), 주관식/선택형 텍스트 처리
 */

import { Question } from '@/lib/types';
import ImageScale from './ImageScale';
import ImageChoice from './ImageChoice';
import MBTIChoice from './MBTIChoice';
import ChoiceList from './ChoiceList';
import TextAnswer from './TextAnswer';

interface AnswerProps {
  question: Question;
  answer?: string | string[];
  onAnswer: (v: string | string[]) => void;
}

export default function Answer({ question, answer, onAnswer }: AnswerProps) {
  // Q1~Q2: 이미지 여러 개 선택
  if (question.questionId === 1 || question.questionId === 2) {
    const selected = (answer as string[]) || [];
    return <ImageScale question={question} selected={selected} onSelect={onAnswer} />;
  }

  // Q3: MBTI 선택
  if (question.questionId === 3) {
    return <MBTIChoice selected={answer as string} onSelect={onAnswer as (v: string) => void} />;
  }

  // Q5, Q7: 이미지 2개 중 1개 선택
  if (question.questionId === 5 || question.questionId === 7) {
    return (
      <ImageChoice
        questionId={question.questionId}
        choices={question.choices || []}
        selected={answer as string || ''}
        onSelect={onAnswer as (v: string) => void}
      />
    );
  }

  // 주관식
  if (!question.choices) {
    return <TextAnswer value={answer as string || ''} onChange={onAnswer as (v: string) => void} />;
  }

  // 선택형 텍스트
  return <ChoiceList choices={question.choices} selected={answer as string || ''} onSelect={onAnswer as (v: string) => void} />;
}