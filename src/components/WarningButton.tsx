import { useState, useEffect, useRef } from "react";
import WarningBell from "../assets/warningBell.svg?react";
import { WarningModal } from "./WarningModal";

type WarningLevel = "SAFE" | "READY" | "WARNING" | "DANGER" | "RUN";

interface WarningButtonProps {
    warningLevel: WarningLevel;
}

const STATUS_CONFIG = {
    SAFE: {
        color: "#03ff00",
        label: "Safe",
    },
    READY: {
        color: "#ffff00",
        label: "Ready",
    },
    WARNING: {
        color: "#ff7f00",
        label: "Warning",
    },
    DANGER: {
        color: "#ff0000",
        label: "Danger",
    },
    RUN: {
        color: "#000000",
        label: "Run",
    },
};

export const WarningButton = ({ warningLevel }: WarningButtonProps) => {
    console.log(warningLevel);
    const [isOpen, setIsOpen] = useState(false);
    const prevLevel = useRef<WarningLevel>("SAFE");

    const config = STATUS_CONFIG[warningLevel as keyof typeof STATUS_CONFIG];

    useEffect(() => {
        if (prevLevel.current === "SAFE" && warningLevel !== "SAFE") {
            setIsOpen(true);
        }

        prevLevel.current = warningLevel;
    }, [warningLevel]);
    return (
        <>
            <div className="flex flex-col absolute top-4 left-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: config.color }}
                >
                    <WarningBell className="w-8 h-8 text-black" />
                </button>
            </div>

            {isOpen && (
                <WarningModal onClose={() => setIsOpen(false)} barColor={config.color}>
                    <h2 className="font-bold text-lg">{config.label}</h2>
                    <p className="text-gray-400 text-sm">Text</p>
                </WarningModal>
            )}
        </>
    );
};
