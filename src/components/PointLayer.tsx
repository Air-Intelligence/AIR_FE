import { useEffect } from "react";
import { useMapBounds } from "../hooks/useMapBounds";
import { weatherApi } from "../api/weather";

interface PointLayerProps {
    map: mapboxgl.Map | null;
}

export const PointLayer = ({ map }: PointLayerProps) => {
    const bounds = useMapBounds(map);

    useEffect(() => {
        if (!map || !bounds) return;

        const fetchData = async () => {
            try {
                const data = await weatherApi.getPoints({
                    lowerLat: bounds.southWest.lat,
                    lowerLon: bounds.southWest.lng,
                    upperLat: bounds.northEast.lat,
                    upperLon: bounds.northEast.lng,
                });

                const geoJson = data.content;

                if (map.getSource("weather-points")) {
                    (map.getSource("weather-points") as mapboxgl.GeoJSONSource).setData(
                        geoJson as any
                    );
                } else {
                    map.addSource("weather-points", {
                        type: "geojson",
                        data: geoJson as any,
                    });

                    // ✅ 포인트 원(circle)으로 표시
                    map.addLayer({
                        id: "weather-points-circle",
                        type: "circle",
                        source: "weather-points",
                        paint: {
                            "circle-radius": 8,
                            "circle-color": "#1E3A8A", // 파란색
                            "circle-stroke-width": 2,
                            "circle-stroke-color": "#ffffff",
                        },
                    });

                    // ✅ 값(label) 표시
                    map.addLayer({
                        id: "weather-points-label",
                        type: "symbol",
                        source: "weather-points",
                        layout: {
                            "text-field": ["get", "value"],
                            "text-size": 12,
                            "text-offset": [0, 1.2],
                            "text-anchor": "top",
                        },
                        paint: {
                            "text-color": "#000000",
                            "text-halo-color": "#ffffff",
                            "text-halo-width": 1,
                        },
                    });
                }
            } catch (err) {
                console.error("Point API 호출 실패:", err);
            }
        };

        fetchData();
    }, [map, bounds]);

    return null;
};
