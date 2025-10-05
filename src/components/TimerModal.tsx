import { useState, useEffect, useMemo } from "react";

import { cn } from "../lib/utils";
import ReadyIcon from "../assets/ReadyIcon.svg?react";
import WarningIcon from "../assets/WarningIcon.svg?react";
import DangerIcon from "../assets/DangerIcon.svg?react";
import RunIcon from "../assets/RunIcon.svg?react";
import SleepingFace from "../assets/sleeping-face.svg?react";
import RunningMan from "../assets/RunningMan.svg?react";
import EndSymbol from "../assets/EndSymbol.svg?react";

type TimerState = "ready" | "warning" | "danger" | "run" | "done";

interface TimerModalProps {
    state: TimerState;
    hour: number; // 일단은 hour 로만 받음
    overrideSeconds?: number;
    progress?: number;
    onClose: () => void;
}

/**
 * 색상을 바깥에서 props 로 전달해 주면 됨
 */
export const TimerModal = ({
    state,
    hour,
    overrideSeconds,
    progress = 0,
    onClose,
}: TimerModalProps) => {
    const [timerState, setTimerState] = useState<TimerState>(state);

    const totalSeconds = hour * 3600;

    const secondsLeft = useMemo(() => {
        if (overrideSeconds !== undefined) return overrideSeconds;
        return totalSeconds;
    }, [overrideSeconds, totalSeconds]);

    const formatTime = (s: number) => {
        const h = String(Math.floor(s / 3600)).padStart(2, "0");
        const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
        const sec = String(s % 60).padStart(2, "0");
        return `${h}:${m}:${sec}`;
    };

    const iconMap = {
        ready: <ReadyIcon className="w-16 h-16" />,
        warning: <WarningIcon className="w-16 h-16" />,
        danger: <DangerIcon className="w-16 h-16" />,
        run: <RunIcon className="w-16 h-16" />,
    };

    const colorMap: Record<TimerState, string> = {
        ready: "#4ADE80", // green
        warning: "#FACC15", // yellow
        danger: "#EF4444", // red
        run: "#3B82F6", // blue
    };

    useEffect(() => {
        if (secondsLeft <= 0) {
            setTimerState("done");
        }
    }, [secondsLeft]);
    console.log(timerState);
    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            onClick={onClose}
        >
            {timerState === "done" ? (
                <div
                    className="rounded-3xl w-[320px] h-[320px] p-6 flex flex-col items-center shadow-xl bg-[#fff8f0]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex h-full justify-center items-center">
                        <SleepingFace className="w-17 h-17 mb-3" />
                    </div>
                    {/* OK 버튼 */}
                    <button
                        onClick={onClose}
                        className={cn(
                            "w-44 h-13 rounded-xl text-white font-medium",
                            "bg-black active:bg-gray-800"
                        )}
                    >
                        OK
                    </button>
                </div>
            ) : (
                <div
                    className="bg-[#fff8f0] rounded-3xl w-[320px] h-[320px] p-6 flex flex-col items-center shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Icon */}
                    <div className="mb-2">{iconMap[timerState]}</div>

                    {/* 상태 텍스트 */}
                    <h2 className="font-bold text-base mb-3 capitalize">{state}</h2>

                    {/* 시간 */}
                    <div className="text-[45px] font-bold leading-[100%] mb-8">
                        {formatTime(secondsLeft)}
                    </div>

                    {/* Progress bar */}
                    <div className="relative w-[90%] mx-auto h-1 rounded-full bg-gray-200 overflow-visible mb-6">
                        {/* 진행된 부분 */}
                        <div
                            className="absolute top-0 left-0 h-full transition-all"
                            style={{
                                width: `${progress * 100}%`,
                                backgroundColor: colorMap[state],
                            }}
                        />

                        {/* 시작점 원 */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full shadow"
                            style={{
                                left: "-8px",
                                backgroundColor: colorMap[state],
                            }}
                        />

                        {/* 러닝맨 */}
                        <div
                            className="absolute -top-2.5 transition-all"
                            style={{
                                left: `calc(${progress * 100}% - 12px)`,
                            }}
                        >
                            <RunningMan className="w-6 h-6" />
                        </div>

                        {/* 마지막 원 */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-[-8px]">
                            <EndSymbol className="w-3 h-3" />
                        </div>
                    </div>

                    {/* OK 버튼 */}
                    <button
                        onClick={onClose}
                        className={cn(
                            "w-44 h-13 rounded-xl text-white font-medium",
                            "bg-black active:bg-gray-800"
                        )}
                    >
                        OK
                    </button>
                </div>
            )}
        </div>
    );
};
