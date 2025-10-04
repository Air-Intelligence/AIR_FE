import { useEffect, useState, useRef } from "react";

interface Bounds {
    southWest: { lat: number; lng: number };
    northEast: { lat: number; lng: number };
}

export const useMapBounds = (map: mapboxgl.Map | null) => {
    const [bounds, setBounds] = useState<Bounds | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!map) return;

        const updateBounds = () => {
            if (timeoutRef.current) return; // 이미 대기 중이면 무시

            timeoutRef.current = setTimeout(() => {
                const b = map.getBounds() as mapboxgl.LngLatBounds;
                const sw = b.getSouthWest();
                const ne = b.getNorthEast();
                setBounds({
                    southWest: { lat: sw.lat, lng: sw.lng },
                    northEast: { lat: ne.lat, lng: ne.lng },
                });
                timeoutRef.current = null; // 다음 호출 준비
            }, 1000);
        };

        // 이벤트 리스너 등록
        map.on("move", updateBounds);
        map.on("zoom", updateBounds);

        // 초기 값
        updateBounds();

        return () => {
            map.off("move", updateBounds);
            map.off("zoom", updateBounds);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [map]);

    return bounds;
};
