import type { ReactNode } from "react";

interface BottomSheetProps {
    children: ReactNode;
}

export const BottomSheet = ({ children }: BottomSheetProps) => {
    return (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-t-3xl shadow-lg p-6">
                {/* 상단 핸들 */}
                <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-300" />
                {children}
            </div>
        </div>
    );
};
