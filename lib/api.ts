const API_BASE_URL = 'https://cauhackathon-team2.p-e.kr';

import { LoginRequest, LoginResponse, UserInfo, Question } from "./types";

async function parseResponse(res: Response) {
    const text = await res.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch {
        return text;
    }
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const parsed = await parseResponse(response);

    if (!response.ok) {
        const err: any = new Error(parsed?.message ?? response.statusText ?? '로그인에 실패했습니다.');
        err.status = response.status;
        err.response = parsed;
        throw err;
    }

    return parsed as LoginResponse;
}

export async function joinUser(body: { name: string; password: string; gender?: string; answers: Record<string, string>; }) {
    const response = await fetch(`${API_BASE_URL}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const parsed = await parseResponse(response);
    if (!response.ok) {
        const err: any = new Error(parsed?.message ?? response.statusText ?? '회원가입에 실패했습니다.');
        err.status = response.status;
        err.response = parsed;
        throw err;
    }

    return parsed;
}

export async function getUserInfo(id: number): Promise<UserInfo> {
    const response = await fetch(`${API_BASE_URL}/my/${id}`);
    const parsed = await parseResponse(response);
    if (!response.ok) {
        const err: any = new Error(parsed?.message ?? response.statusText ?? '사용자 정보를 불러오는데 실패했습니다.');
        err.status = response.status;
        err.response = parsed;
        throw err;
    }

    return parsed as UserInfo;
}

export async function getQuestions(): Promise<Question[]> {
    const response = await fetch(`${API_BASE_URL}/question`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const parsed = await parseResponse(response);
    if (!response.ok) {
        const err: any = new Error(parsed?.message ?? response.statusText ?? '질문을 불러오는데 실패했습니다.');
        err.status = response.status;
        err.response = parsed;
        throw err;
    }

    return parsed as Question[];
}