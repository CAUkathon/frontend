export interface LoginRequest {
    name: string;
    password: string;
}

export interface LoginResponse {
    memberId: number;
    name: string;
    role: 'BABY' | 'ADULT';
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