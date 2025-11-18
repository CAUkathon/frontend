/**
 * LoginForm
 */

'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";              // ⭐ 추가됨
import { loginUser } from "@/lib/api";
import { LoginRequest } from "@/lib/types";

export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

  const [gender, setGender] = useState<string>("남자");

  // 로그인 요청
  const onSubmit = async (data: LoginRequest) => {
    try {
      const loginRes = await loginUser(data);

      console.log("🔵 로그인 요청 데이터:", data);
      console.log("🟢 서버 로그인 응답(loginRes):", loginRes);

      // ==========================================================
      //  쿠키 저장 (middleware는 sessionStorage를 못 읽기 때문에 필수!)
      // ==========================================================

      // user 쿠키 저장
      Cookies.set("user", JSON.stringify({
        memberId: loginRes.memberId,
        name: loginRes.name,
        role: loginRes.role,
      }), { path: "/" });

      // 관리자라면 토큰도 쿠키에 저장
      if (loginRes.accessToken) {
        Cookies.set("token", loginRes.accessToken, { path: "/" });
        console.log("관리자 토큰 저장됨:", loginRes.accessToken);
      }

      // role에 따라 페이지 이동
      if (loginRes.role === "ADULT") {
        router.push("/adult");
      } else {
        router.push(`/mypage/${loginRes.memberId}`);
      }

    } catch (error: any) {

      const status =
        error?.status ??
        error?.response?.status ??
        (typeof error === "string" && error.includes("403") ? 403 :
         typeof error === "string" && error.includes("409") ? 409 :
         undefined);

      const message = error?.message ?? "";

      // 409 = 비밀번호 틀림
      if (status === 409 || message.includes("비밀번호")) {
        alert("비밀번호가 올바르지 않습니다.");
        return;
      }

      // 403 = 미가입 유저
      if (status === 403 || message.includes("가입되지 않은")) {
        Cookies.set("signup", JSON.stringify({
          name: data.name,
          password: data.password,
          gender,
        }), { path: "/" });

        router.push("/questions");
        return;
      }

      alert(message || "로그인에 실패했습니다.");
    }
  };

  // 유효성 검사 실패 시 alert
  const onInvalid = (errors: any) => {
    if (errors.name?.message) alert(errors.name.message);
    else if (errors.password?.message) alert(errors.password.message);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col items-center gap-2">
        
        {/* 이름 입력 */}
        <div className="flex">
          <input
            {...register("name", { required: "이름을 입력하세요." })}
            placeholder="이름"
            className="w-[268px] h-[35px] rounded-full border border-gray-300 px-3"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="flex">
          <input
            {...register("password", {
              required: "비밀번호를 입력하세요.",
              minLength: { value: 4, message: "비밀번호를 4자리로 설정해주세요." },
              maxLength: { value: 4, message: "비밀번호를 4자리로 설정해주세요." },
            })}
            type="password"
            placeholder="4자리 비밀번호"
            className="w-[268px] h-[35px] rounded-full border border-gray-300 px-3"
          />
        </div>

        {/* 성별 선택 */}
        <div className="flex justify-center items-center gap-2">
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="h-[35px] border border-gray-300 rounded-full px-3"
          >
            <option value="남자">남자</option>
            <option value="여자">여자</option>
          </select>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="text-2xl border border-gray-300 rounded-full px-5 py-2 mt-7 text-white hover:brightness-95"
          style={{ backgroundColor: "#FF6F00" }}
        >
          시작하기
        </button>

      </form>
    </div>
  );
}
