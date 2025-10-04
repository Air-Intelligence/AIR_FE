import { useEffect, useRef, useMemo, useState } from "react";
import mapboxgl from "mapbox-gl";

import { useGeolocation } from "../../hooks/useGeolocation";
import { PolygonLayer } from "../../components/PolygonLayer";
import { PointLayer } from "../../components/PointLayer";
import { WarningButton } from "../../components/WarningButton";
import { InfoButton } from "../../components/InfoButton";
import { ZoomControl } from "../../components/ZoomControl";

mapboxgl.accessToken =
    "pk.eyJ1Ijoia2lteW9uZ2hlZSIsImEiOiJjbWdhYXIydHowMnQ5MnJwcXE1c2xocGlkIn0.WGfrPNNfolUzbsu1u6QZ_w";

// console.log("Mapbox key:", import.meta.env.VTIE_PUBLIC_MAPBOX_KEY); 왜 안됨?

export const HomePage = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    const initialized = useRef(false);

    const [zoomLevel, setZoomLevel] = useState<number>(7);

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

        const scale = new mapboxgl.ScaleControl({
            maxWidth: 200, // px 단위 (기본값 100)
            unit: "metric", // 'imperial' (mile/feet) 도 가능
        });
        mapRef.current.addControl(scale, "bottom-left");

        setZoomLevel(mapRef.current.getZoom());

        mapRef.current.on("zoom", () => {
            setZoomLevel(mapRef.current!.getZoom());
        });

        mapRef.current.on("moveend", () => {
            setZoomLevel(mapRef.current!.getZoom());
        });
    }, []);

    useEffect(() => {
        if (lat && lng && mapRef.current) {
            if (!initialized.current) {
                mapRef.current.setZoom(7);
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

    /** PolygonLayer visibility 제어 */
    useEffect(() => {
        const polygonVisible = zoomLevel > 8;
        if (!mapRef.current) return;
        const fillId = "weather-polygon-fill";
        const lineId = "weather-polygon-outline";

        if (mapRef.current.getLayer(fillId)) {
            mapRef.current.setLayoutProperty(
                fillId,
                "visibility",
                polygonVisible ? "visible" : "none"
            );
        }
        if (mapRef.current.getLayer(lineId)) {
            mapRef.current.setLayoutProperty(
                lineId,
                "visibility",
                polygonVisible ? "visible" : "none"
            );
        }
    }, [zoomLevel]);

    /**  PointLayer visibility 제어 */
    useEffect(() => {
        const pointVisible = zoomLevel <= 8;
        if (!mapRef.current) return;
        const circleId = "weather-points-circle";
        const labelId = "weather-points-label";

        if (mapRef.current.getLayer(circleId)) {
            mapRef.current.setLayoutProperty(
                circleId,
                "visibility",
                pointVisible ? "visible" : "none"
            );
        }
        if (mapRef.current.getLayer(labelId)) {
            mapRef.current.setLayoutProperty(
                labelId,
                "visibility",
                pointVisible ? "visible" : "none"
            );
        }
    }, [zoomLevel]);

    if (error) {
        return <div>내 위치 정보를 가져올 수 없습니다: {error}</div>;
    }

    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

            <WarningButton />
            <InfoButton />

            <PolygonLayer map={mapRef.current} />
            <PointLayer map={mapRef.current} />

            <ZoomControl map={mapRef.current} />
        </div>
    );
};
