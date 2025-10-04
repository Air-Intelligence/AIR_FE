import React, { useState } from "react";
import { TutorialModal } from "./TutorialModal";
import SafeIcon from "../assets/SafeIcon.svg?react";
import ReadyIcon from "../assets/ReadyIcon.svg?react";
import WarningIcon from "../assets/WarningIcon.svg?react";
import DangerIcon from "../assets/DangerIcon.svg?react";
import RunIcon from "../assets/RunIcon.svg?react";

export const OnboardingModal = ({ onFinish }: { onFinish: () => void }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < 2) {
            setStep((prev) => prev + 1);
        } else {
            onFinish();
        }
    };

    return (
        <>
            {step === 0 && (
                <TutorialModal title="Recommended guidelines" onNext={handleNext}>
                    <div className="justify-center space-y-4">
                        <div className="flex items-center gap-12">
                            <span className="w-15 h-15 rounded-full bg-[#00ff00]"></span>
                            <span>Safe</span>
                            <SafeIcon />
                        </div>
                        <div className="flex items-center gap-12">
                            <span className="w-15 h-15 rounded-full bg-[#ffff00]"></span>
                            <span>Ready</span>
                            <ReadyIcon />
                        </div>
                        <div className="flex items-center gap-12">
                            <span className="w-15 h-15 rounded-full bg-[#ff8811]"></span>
                            <span>Watch</span>
                            <WarningIcon />
                        </div>
                        <div className="flex items-center gap-12">
                            <span className="w-15 h-15 rounded-full bg-[#ff0000]"></span>
                            <span>Warning</span>
                            <DangerIcon />
                        </div>
                        <div className="flex items-center gap-12">
                            <span className="w-15 h-15 rounded-full bg-[#000]"></span>
                            <span>Run</span>
                            <RunIcon />
                        </div>
                    </div>
                </TutorialModal>
            )}

            {step === 1 && (
                <TutorialModal title="Recommended guidelines" onNext={handleNext}>
                    <div className="grid grid-cols-2 gap-6 text-center">
                        <div>
                            <img
                                src="/masks/surgical.png"
                                className="w-20 h-20 mx-auto opacity-40"
                            />
                            <p className="mt-2 text-sm text-red-500">Surgical Mask (X)</p>
                        </div>
                        <div>
                            <img src="/masks/n95.png" className="w-20 h-20 mx-auto" />
                            <p className="mt-2 text-sm">N95 (O)</p>
                        </div>
                        <div>
                            <img src="/masks/kn95.png" className="w-20 h-20 mx-auto" />
                            <p className="mt-2 text-sm">KN95 (O)</p>
                        </div>
                        <div>
                            <img src="/masks/kf95.png" className="w-20 h-20 mx-auto" />
                            <p className="mt-2 text-sm">KF95 (O)</p>
                        </div>
                    </div>
                </TutorialModal>
            )}

            {step === 2 && (
                <TutorialModal title="Welcome" onNext={handleNext}>
                    <div className="text-center space-y-4">
                        <p className="text-gray-700">
                            위치 기반으로 공기질을 감지하고 위험도를 알려드립니다.
                        </p>
                        <p className="text-gray-500 text-sm">
                            알림을 활성화하면 실시간으로 안전 가이드를 받아볼 수 있습니다.
                        </p>
                    </div>
                </TutorialModal>
            )}
        </>
    );
};
