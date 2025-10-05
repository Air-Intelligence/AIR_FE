import { useState } from "react";
import { TutorialModal } from "./TutorialModal";
import SafeIcon from "../assets/SafeIcon.svg?react";
import ReadyIcon from "../assets/ReadyIcon.svg?react";
import WarningIcon from "../assets/WarningIcon.svg?react";
import DangerIcon from "../assets/DangerIcon.svg?react";
import RunIcon from "../assets/RunIcon.svg?react";

import SurgicalMask from "../assets/SurgicalMask.svg?react";
import N95 from "../assets/N95.svg?react";
import KN95 from "../assets/KN95.svg?react";
import KF95 from "../assets/KF95.svg?react";

import MaskFirst from "../assets/MaskFirst.svg?react";
import MaskSecond from "../assets/MaskSecond.svg?react";
import MaskThird from "../assets/MaskThird.svg?react";
import MaskFour from "../assets/MaskFour.svg?react";

import RedX from "../assets/RedX.svg?react";
import GreenO from "../assets/GreenO.svg?react";

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
                    <div className="items-center justify-center space-y-3">
                        <div className="flex items-center justify-between gap-12">
                            <span className="w-15 h-15 rounded-full bg-[#00ff00]"></span>
                            <span>Safe</span>
                            <SafeIcon />
                        </div>
                        <div className="flex items-center justify-between gap-12">
                            <span className="w-15 h-15 rounded-full bg-[#ffff00]"></span>
                            <span>Mask Ready</span>
                            <ReadyIcon />
                        </div>
                        <div className="flex items-center justify-between gap-12">
                            <span className="w-15 h-15 rounded-full bg-[#ff8811]"></span>
                            <span>Watch</span>
                            <WarningIcon />
                        </div>
                        <div className="flex items-center justify-between gap-12">
                            <span className="w-15 h-15 rounded-full bg-[#ff0000]"></span>
                            <span>Warning</span>
                            <DangerIcon />
                        </div>
                        <div className="flex items-center justify-between gap-12">
                            <span className="w-15 h-15 rounded-full bg-[#000]"></span>
                            <span>Run</span>
                            <RunIcon />
                        </div>
                    </div>
                </TutorialModal>
            )}

            {step === 1 && (
                <TutorialModal title="Recommended guidelines" onNext={handleNext}>
                    <div className="grid grid-cols-2 gap-6 text-center overflow-hidden">
                        <div className="flex flex-col justify-between">
                            <SurgicalMask />
                            <div className="flex flex-row items-center justify-center gap-2">
                                <p className="mt-2 text-sm">Surgical Mask</p> <RedX />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <N95 />
                            <div className="flex flex-row items-center justify-center gap-2">
                                <p className="mt-2 text-sm">N95</p> <GreenO />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <KN95 />
                            <div className="flex flex-row items-center justify-center gap-2">
                                <p className="mt-2 text-sm">KN95</p>
                                <GreenO />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <KF95 />
                            <div className="flex flex-row items-center justify-center gap-2">
                                <p className="mt-2 text-sm">KF95</p>
                                <GreenO />
                            </div>
                        </div>
                    </div>
                </TutorialModal>
            )}

            {step === 2 && (
                <TutorialModal title="Recommended guidelines" onNext={handleNext}>
                    <div className="grid grid-cols-2 gap-6 text-center overflow-hidden">
                        <div className="flex flex-col justify-between">
                            <MaskFirst />
                            <div className="flex flex-row items-center justify-center mt-2">
                                <RedX />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <MaskSecond />
                            <div className="flex flex-row items-center justify-center">
                                <GreenO />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <MaskThird />
                            <div className="flex flex-row items-center justify-center mt-2">
                                <GreenO />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <MaskFour />
                            <div className="flex flex-row items-center justify-center">
                                <GreenO />
                            </div>
                        </div>
                    </div>
                </TutorialModal>
            )}
        </>
    );
};
