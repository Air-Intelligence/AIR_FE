import { useNavigate } from "react-router-dom";

import InfoIcon from "../assets/InfoIcon.svg?react";

export const InfoButton = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col absolute top-4 right-4">
            <button
                onClick={() => navigate("welcome")}
                className="w-16 h-16 bg-[#ff7f00] rounded-2xl flex items-center justify-center shadow-md"
            >
                <InfoIcon className="w-8 h-8 text-black" />
            </button>
        </div>
    );
};
