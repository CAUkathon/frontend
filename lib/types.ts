export interface LoginRequest {
    name: string;
    password: string;
}

export interface LoginResponse {
    memberId: number;
    name: string;
    role: 'BABY' | 'ADULT';
    hasQuestionResult?: boolean;

    accessToken?: string;
    refreshToken?: string;
}

export interface UserInfo {
    id: number;
    name: string;
    role: 'BABY' | 'ADULT';
}

export interface Question {
    questionId: number;
    content: string;
    type?: 'metric' | 'text' | 'choice' | 'mbti';
    choices?: string[];
}

// MyPage 사용자 정보
export interface MyPageUser {
  id: number;
  name: string;
  role: 'BABY' | 'ADULT';
  answer: string;
  image: string;
  description: string;
  teamBuilt: boolean;
}