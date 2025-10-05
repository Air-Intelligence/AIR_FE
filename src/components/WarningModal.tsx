import type { ReactNode } from "react";

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
    barColor?: string;
}

/**
 * 색상을 바깥에서 props 로 전달해 주면 됨
 */
export const WarningModal = ({ children, onClose, barColor = "#f97316" }: ModalProps) => {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            onClick={onClose}
        >
            <div className="relative flex flex-col w-95 h-76 rounded-[24px] overflow-hidden bg-white shadow-lg">
                {/* 상단 오렌지 바 */}
                <div className="h-13" style={{ backgroundColor: barColor }} />

                {/* 콘텐츠 영역 */}
                <div className="flex flex-col items-center px-6 mt-4 space-y-4">
                    {children}
                </div>

                {/* 하단 버튼 */}
                <div className="absolute left-0 right-0 bottom-10">
                    <button
                        onClick={onClose}
                        className="w-44 h-13 mx-auto block rounded-xl bg-[#1B1725] py-3 text-white font-bold text-sm"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};
