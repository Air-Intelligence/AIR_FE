// src/components/TimerTrigger.tsx
import { useEffect, useState } from "react";
import TimerIcon from "../assets/timerIcon.svg?react";
import { TimerModal } from "./TimerModal";

type TimerState = "ready" | "warning" | "danger" | "run";

interface TimerTriggerProps {
    state?: TimerState;
    hour?: number; // 타이머 총 시간
}

export const TimerTrigger = ({
    state = "run",
    hour = 1, // 기본 1시간
}: TimerTriggerProps) => {
    const [showModal, setShowModal] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(hour * 3600);
    const totalSeconds = hour * 3600;

    /** 타이머는 모달 상태와 무관하게 계속 감소 */
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const progress = 1 - secondsLeft / totalSeconds;

    return (
        <>
            {/* 타이머 아이콘 버튼 */}
            <div className="flex flex-col absolute top-4 left-24">
                <button
                    onClick={handleOpen}
                    className="w-16 h-16 bg-[#FFCE48] rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                    <TimerIcon className="w-8 h-8 text-black" />
                </button>
            </div>

            {/* 모달은 시각화만 담당 */}
            {showModal && (
                <TimerModal
                    state={state}
                    hour={hour}
                    onClose={handleClose}
                    overrideSeconds={secondsLeft}
                    progress={progress}
                />
            )}
        </>
    );
};
