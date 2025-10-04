import { useEffect, useRef, useMemo } from "react";
import mapboxgl from "mapbox-gl";

import { useGeolocation } from "../../hooks/useGeolocation";

mapboxgl.accessToken =
    "pk.eyJ1Ijoia2lteW9uZ2hlZSIsImEiOiJjbWdhYXIydHowMnQ5MnJwcXE1c2xocGlkIn0.WGfrPNNfolUzbsu1u6QZ_w";

// console.log("Mapbox key:", import.meta.env.VTIE_PUBLIC_MAPBOX_KEY); 왜 안됨?

export const HomePage = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    const initialized = useRef(false);

    /** 임시로 100000s 로 바꿈 */
    const { lat, lng, error } = useGeolocation(
        100000,
        useMemo(() => ({ enableHighAccuracy: true }), [])
    );

    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: "mapbox://styles/mapbox/streets-v12",
            attributionControl: false,
            center: [126.978, 37.5665],
            zoom: 7,
        });

        // mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    }, []);

    useEffect(() => {
        // console.log(`위도: ${lat}, 경도: ${lng}`);
        if (lat && lng && mapRef.current) {
            // mapRef.current.setCenter([lng, lat]);

            if (!initialized.current) {
                mapRef.current.setZoom(12);
                mapRef.current.setCenter([lng, lat]);
                initialized.current = true;
            }

            if (!markerRef.current) {
                // 마커 없으면 새로 만들고
                markerRef.current = new mapboxgl.Marker({ color: "red" })
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current);
            } else {
                // 있으면 위치만 갱신
                markerRef.current.setLngLat([lng, lat]);
            }
        }
    }, [lat, lng]);

    if (error) {
        return <div>내 위치 정보를 가져올 수 없습니다: {error}</div>;
    }

    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

            {/* 확대/축소 버튼 */}
            <div className="flex flex-col absolute right-4 bottom-8 w-16 h-44 rounded-[16px] overflow-hidden">
                <button
                    className="flex-1 bg-[#FFCE48] text-black text-2xl font-bold flex items-center justify-center"
                    onClick={() => mapRef.current?.zoomIn()}
                >
                    +
                </button>
                <div className="h-px bg-yellow-300" />
                <button
                    className="flex-1 bg-[#FFCE48] text-black text-2xl font-bold flex items-center justify-center"
                    onClick={() => mapRef.current?.zoomOut()}
                >
                    −
                </button>
            </div>
        </div>
    );
};
