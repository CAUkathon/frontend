/**
 * ResetModal.tsx
 * - 팀빌딩 전체 리셋용 모달
 */

'use client';

interface ResetModalProps {
  show: boolean;
  setShow: (val: boolean) => void;
  onConfirm: () => void;
}

export default function ResetModal({ show, setShow, onConfirm }: ResetModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-72 text-center">
        <h2 className="text-xl mb-3">정말 리셋할까요?</h2>
        <p className="text-gray-600 mb-5">모든 팀 데이터가 삭제됩니다.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-full bg-red-500 text-white hover:brightness-95"
          >
            리셋
          </button>
        </div>
      </div>
    </div>
  );
}