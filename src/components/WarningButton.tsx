import { useState, useEffect, useRef } from "react";
import WarningBell from "../assets/warningBell.svg?react";
import { WarningModal } from "./WarningModal";

import SafeIcon from "../assets/SafeIcon.svg?react";
import ReadyIcon from "../assets/ReadyIcon.svg?react";
import WarningIcon from "../assets/WarningIcon.svg?react";
import DangerIcon from "../assets/DangerIcon.svg?react";
import RunIcon from "../assets/RunIcon.svg?react";

type WarningLevel = "SAFE" | "READY" | "WARNING" | "DANGER" | "RUN";

interface WarningButtonProps {
    warningLevel: WarningLevel;
}

const STATUS_CONFIG = {
    SAFE: {
        color: "#03ff00",
        label: "Safe",
        Icon: SafeIcon,
    },
    READY: {
        color: "#ffff00",
        label: "Ready",
        Icon: ReadyIcon,
    },
    WARNING: {
        color: "#ff7f00",
        label: "Warning",
        Icon: WarningIcon,
    },
    DANGER: {
        color: "#ff0000",
        label: "Danger",
        Icon: DangerIcon,
    },
    RUN: {
        color: "#000000",
        label: "Run",
        Icon: RunIcon,
    },
};

export const WarningButton = ({ warningLevel }: WarningButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const prevLevel = useRef<WarningLevel>("SAFE");

    const config = STATUS_CONFIG[warningLevel as keyof typeof STATUS_CONFIG];
    const Icon = config.Icon;

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
                    {Icon && <Icon className="w-18 h-18" />}
                    <h2 className="font-bold text-lg">{config.label}</h2>
                </WarningModal>
            )}
        </>
    );
};
