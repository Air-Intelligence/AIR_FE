import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { userApi } from "../api/user";

type WarningLevel = "SAFE" | "READY" | "WARNING" | "DANGER" | "RUN";

interface WarningLevelContextValue {
    warningLevel: WarningLevel | null;
}

const WarningLevelContext = createContext<WarningLevelContextValue | undefined>(undefined);

export const WarningLevelProvider = ({ children }: { children: ReactNode }) => {
    const [warningLevel, setWarningLevel] = useState<WarningLevel | null>(null);
    const location = useGeolocation();

    useEffect(() => {
        const update = async () => {
            if (location.lat && location.lng) {
                try {
                    const res = await userApi.updateLastCoord({
                        lat: location.lat,
                        lng: location.lng,
                    });
                    setWarningLevel(res.content.warningLevel);
                } catch (e) {
                    console.error("warningLevel 업데이트 실패:", e);
                }
            }
        };

        update();
    }, [location.lat, location.lng]);

    return (
        <WarningLevelContext.Provider value={{ warningLevel }}>
            {children}
        </WarningLevelContext.Provider>
    );
};

export const useWarningLevel = () => {
    const ctx = useContext(WarningLevelContext);
    if (!ctx) throw new Error("useWarningLevel은 WarningLevelProvider 내부에서만 사용해야 합니다.");
    return ctx;
};
