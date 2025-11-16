/**
 * API 함수 모음
 * - loginUser: 로그인
 * - joinUser: 회원가입/질문 제출
 * - getUserInfo: 유저 정보 조회
 * - getQuestions: 질문 리스트 조회
 * 
 * fetchJSON으로 공통 fetch 처리
 */

import { LoginRequest, Question } from "./types";

const API_BASE_URL = 'https://cauhackathon-team2.p-e.kr';

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: any = null;

  try { data = text ? JSON.parse(text) : null; } 
  catch { data = text; }

  if (!res.ok) {
    const err: any = new Error(data?.message ?? res.statusText ?? 'API 호출 실패');
    err.status = res.status;
    err.response = data;
    throw err;
  }

  return data;
}

export async function loginUser(data: LoginRequest) {
  return fetchJSON(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function joinUser(body: { name: string; password: string; gender?: string; answers: Record<string, string>; }) {
  return fetchJSON(`${API_BASE_URL}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function getUserInfo(id: number) {
  return fetchJSON(`${API_BASE_URL}/my/${id}`);
}

export async function getQuestions(): Promise<Question[]> {
  return fetchJSON(`${API_BASE_URL}/question`);
}