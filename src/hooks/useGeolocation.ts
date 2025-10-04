import { useEffect, useState } from "react";

interface GeolocationProps {
    lat: number | null;
    lng: number | null;
    error: string | null;
}

export const useGeolocation = (intervalMs: number = 10000, options?: PositionOptions) => {
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

        const updateLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newLocation = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        error: null,
                    };
                    setLocation(newLocation);
                    localStorage.setItem("userLocation", JSON.stringify(newLocation));
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
