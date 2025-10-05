import type { ReactNode } from "react";
import RightArrow from "../assets/RightArrow.svg?react";
import { cn } from "../lib/utils";

interface TutorialModalProps {
    title?: string;
    children: ReactNode;
    onNext: () => void;
}

export const  TutorialModal = ({ title, children, onNext }: TutorialModalProps) => {
    return (
        <div
            className={cn(
                "fixed inset-0 flex items-center justify-center bg-black/40 z-50",
                "shadow-[0px_0.91px_13.14px_rgba(0,0,0,0.05),0px_4.13px_45.96px_rgba(0,0,0,0.0245)]"
            )}
        >
            <div
                className={cn(
                    "w-91 h-150 rounded-[36px] bg-[#fff8f0]",
                    "shadow-xl flex flex-col items-center justify-center overflow-hidden"
                )}
            >
                <div className="flex flex-col w-full h-full pt-10 pb-5 items-center justify-center">
                    <div className="text-center">
                        {title && (
                            <h2 className="font-semibold leading-none tracking-[-0.01em] text-center text-black">
                                {title}
                            </h2>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 overflow-auto">
                        {children}
                    </div>

                    <div className="w-full px-6">
                        <button
                            onClick={onNext}
                            className="w-full h-14 rounded-xl bg-[#1B1725] flex items-center justify-center text-white"
                        >
                            <RightArrow className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
