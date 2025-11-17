/**
 * DeleteModal.tsx
 * - 유저 개별 삭제용 모달
 */

'use client';

interface DeleteModalProps {
  show: boolean;
  setShow: (val: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteModal({ show, setShow, onConfirm }: DeleteModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-72 text-center">
        <h2 className="text-xl mb-3">정말 삭제할까요?</h2>
        <p className="text-gray-600 mb-5">
          선택한 사용자의 응답이 완전히 삭제됩니다.
        </p>
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
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}