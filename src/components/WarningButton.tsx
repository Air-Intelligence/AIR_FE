// components/WarningButton.tsx
import { useState } from "react";
import WarningBell from "../assets/warningBell.svg?react";
import { WarningModal } from "./WarningModal";

const STATUS_CONFIG = {
    safe: {
        color: "#03ff00",
        label: "Safe",
    },
    ready: {
        color: "#ffff00",
        label: "Ready",
    },
    warning: {
        color: "#ff7f00",
        label: "Warning",
    },
    danger: {
        color: "#ff0000",
        label: "Danger",
    },
    run: {
        color: "#000000",
        label: "Run",
    },
};

export const WarningButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col absolute top-4 left-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-[#ff7f00] rounded-2xl flex items-center justify-center shadow-md"
                >
                    <WarningBell className="w-8 h-8 text-black" />
                </button>
            </div>

            {isOpen && (
                <WarningModal onClose={() => setIsOpen(false)} barColor="#FF9800">
                    <h2 className="font-bold text-lg">Warning</h2>
                    <p className="text-gray-400 text-sm">Text</p>
                </WarningModal>
            )}
        </>
    );
};
