/**
 * API 함수 모음!!
 */

import Cookies from "js-cookie";   // ⭐ 필요함
import { LoginRequest, LoginResponse, Question, MyPageUser } from "./types";

export const API_BASE_URL = "https://cauhackathon-team2.p-e.kr";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const err: any = new Error(data?.message ?? res.statusText ?? "API 호출 실패");
    err.status = res.status;
    err.response = data;
    throw err;
  }

  return data;
}

/* ==================== 로그인 ======================= */

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return fetchJSON(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/* ==================== 회원가입 ======================= */

export async function joinUser(body: {
  name: string;
  password: string;
  gender?: string;
  answers: Record<string, string>;
}): Promise<{ id: number }> {
  return fetchJSON(`${API_BASE_URL}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/* ==================== 유저 정보 ======================= */

export async function getUserInfo(id: number): Promise<MyPageUser> {
  return fetchJSON<MyPageUser>(`${API_BASE_URL}/my/${id}`);
}

export async function getQuestions(): Promise<Question[]> {
  return fetchJSON(`${API_BASE_URL}/question`);
}

/* ============================================================
   🔐 관리자 토큰 필요 API
   ============================================================ */

function getAdminToken() {
  return Cookies.get("token") ?? "";
}

// 팀 빌딩
export async function buildTeams(totalMembers: number, teamCount: number) {
  return fetchJSON(`${API_BASE_URL}/team`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify({ totalMembers, teamCount }),
  });
}

// 팀 삭제
export async function deleteTeams(): Promise<void> {
  return fetchJSON(`${API_BASE_URL}/team`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });
}

// 어른사자 결과 조회
export async function getAdultResults(): Promise<any> {
  return fetchJSON(`${API_BASE_URL}/adult`, {
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });
}

// 팀 정보 조회 (관리자 전용)
export async function getTeamInfo(): Promise<any> {
  return fetchJSON(`${API_BASE_URL}/team`, {
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });
}

/* ============================================================
   일반 API
   ============================================================ */

// 개별 유저 삭제 (토큰 필요 없음)
export async function deleteMember(id: number): Promise<void> {
  return fetchJSON(`${API_BASE_URL}/member/${id}`, { method: "DELETE" });
}
