import { useEffect, useState } from "react";

import { userApi } from "../api/user";

/**
 * 본인의 위치정보를 가져오는 훅입니다.
 * @intervalMs 를 통해 인터벌 설정 가능
 */
interface GeolocationProps {
    lat: number | null;
    lng: number | null;
    error: string | null;
}

export const useGeolocation = (intervalMs: number = 1000, options?: PositionOptions) => {
    const [location, setLocation] = useState<GeolocationProps>(() => {
        // 초기 상태를 localStorage에서 복원
        const saved = localStorage.getItem("userLocation");
        return saved ? JSON.parse(saved) : { lat: null, lng: null, error: null };
    });

    useEffect(() => {
        console.log("effect mounted");
        if (!("geolocation" in navigator)) {
            setLocation({ lat: null, lng: null, error: "Geolocation not supported" });
            return;
        }

        const updateLocation = async () => {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const newLocation = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        error: null,
                    };
                    setLocation(newLocation);
                    localStorage.setItem("userLocation", JSON.stringify(newLocation));

                    // 유저 정보 업데이트
                    try {
                        if (newLocation.lat && newLocation.lng) {
                            await userApi.updateLastCoord({
                                lat: newLocation.lat,
                                lng: newLocation.lng,
                            });
                        }
                    } catch (e) {
                        console.error("좌표 업데이트 실패:", e);
                    }
                },
                (err) => {
                    setLocation({ lat: null, lng: null, error: err.message });
                },
                options
            );
        };

        // 첫 실행
        updateLocation();

        // interval 실행
        const id = setInterval(updateLocation, intervalMs);

        return () => clearInterval(id);
    }, [intervalMs, options]);

    return location;
};
