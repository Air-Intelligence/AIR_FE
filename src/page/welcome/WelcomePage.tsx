import { useNavigate } from "react-router-dom";

import Background from "@/assets/WelcomeBackground.png";
import AirLogo from "../../assets/AirLogo.svg?react";
import RightArrow from "../../assets/RightArrow.svg?react";

export const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div
            className="relative w-full h-screen flex flex-col items-center justify-between"
            style={{ backgroundColor: "#FFCF4C" }}
        >
            <img
                src={Background}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* 콘텐츠 */}
            <div className="relative z-10 flex flex-col justify-end h-full px-6 py-11">
                {/* 상단 로고/타이틀 */}
                <div className="flex flex-col items-start">
                    <AirLogo className="w-20 h-20" />
                    <h1 className="font-baloo font-normal text-[50px] leading-[157%] tracking-normal text-start">
                        Breathe
                    </h1>
                    <p className="mt-4 text-start font-normal leading-[170%] text-black/80">
                        We can help your breath in wildfire areas. We can detecting and predicting
                        air quality in your location. And, we can notice on you. About what can you
                        do in there. We can help on your "Breathe"
                    </p>
                </div>

                {/* 하단 버튼 */}
                <div className="space-y-4 w-full mt-6">
                    <button
                        className="flex w-full h-14 rounded-2xl bg-black items-center justify-center"
                        onClick={() => navigate("/")}
                    >
                        <RightArrow />
                    </button>
                    <div className="text-center text-sm text-black mt-5">Air Intelligence</div>
                </div>
            </div>
        </div>
    );
};
