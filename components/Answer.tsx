import ImageScale from './ImageScale';
import ChoiceList from './ChoiceList';
import TextAnswer from './TextAnswer';
import { Question } from '@/lib/types';
import { useState } from 'react';
import ImageChoice from './ImageChoice';
import MBTIChoice from './MBTIChoice';

interface AnswerProps {
  question: Question;
  answer?: string;
  onAnswer: (v: string) => void;
}

export default function Answer({ question, answer, onAnswer }: AnswerProps) {
  const [selected, setSelected] = useState<string[]>([]);

  // 이미지 척도
  if (question.questionId === 1 || question.questionId === 2) {
    return (
      <ImageScale
        question={question}
        selected={selected}
        onSelect={setSelected}
      />
    );
  }

  // MBTI 선택
  if (question.questionId === 3) {
    return (
        <MBTIChoice
        selected={answer ? JSON.parse(answer) : {}}
        onSelect={(obj) => onAnswer(JSON.stringify(obj))}
        />
    );
    }

  // 이미지 선택
  if (question.questionId === 5 || question.questionId === 7) {
    return (
      <ImageChoice
        questionId={question.questionId}
        choices={question.choices || []}
        selected={answer}
        onSelect={onAnswer}
      />
    );
  }

  // 주관식
  if (!question.choices) {
    return <TextAnswer value={answer || ''} onChange={onAnswer} />;
  }

  // 텍스트 선택
  return (
    <ChoiceList
      choices={question.choices}
      selected={answer}
      onSelect={onAnswer}
    />
  );
}
