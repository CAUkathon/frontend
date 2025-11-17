'use client';

import React from "react";

interface CounterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean; 
}

export default function CounterInput({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  disabled = false
}: CounterInputProps) {

  const decrease = () => {
    if (!disabled && value > min) onChange(value - 1);
  };

  const increase = () => {
    if (!disabled && value < max) onChange(value + 1);
  };

  return (
    <div className="flex flex-col gap-1">
      <span>{label}</span>

      <div
        className={`flex items-center justify-between w-[200px] h-[35px] 
                    border rounded-full px-3 
                    ${disabled ? "border-gray-200 bg-gray-100" : "border-gray-300"}`}
      >
        {/* - 버튼 */}
        <button
          onClick={decrease}
          disabled={disabled}
          className={`w-6 h-6 flex items-center justify-center rounded-full 
                      ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          -
        </button>

        {/* 숫자 */}
        <span className={`text-lg font-medium ${disabled ? "text-gray-400" : ""}`}>
          {value}
        </span>

        {/* + 버튼 */}
        <button
          onClick={increase}
          disabled={disabled}
          className={`w-6 h-6 flex items-center justify-center rounded-full 
                      ${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
