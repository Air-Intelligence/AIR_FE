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

                const roundedFeatures = data.content.features.map((f: any) => ({
                    ...f,
                    properties: {
                        ...f.properties,
                        label: Number(f.properties.value).toFixed(2), // 소수 둘째 자리 반올림 문자열
                    },
                }));

                const geoJson = {
                    ...data.content,
                    features: roundedFeatures,
                };

                if (map.getSource("weather-points")) {
                    (map.getSource("weather-points") as mapboxgl.GeoJSONSource).setData(
                        geoJson as any
                    );
                } else {
                    map.addSource("weather-points", {
                        type: "geojson",
                        data: geoJson as any,
                    });

                    map.addLayer({
                        id: "weather-points-circle",
                        type: "circle",
                        source: "weather-points",
                        paint: {
                            "circle-radius": 8,
                            "circle-color": [
                                "step",
                                ["get", "value"], // 기준값
                                "#7fff00", // 0~19 : 하늘색
                                20,
                                "#ffff00", // 20~39 : 연두
                                40,
                                "#ff8811", // 40~59 : 노랑
                                60,
                                "#ff0000", // 60~79 : 주황
                                80,
                                "#1f1f1f", // 80 이상 : 빨강
                            ],
                            "circle-stroke-width": 2,
                            "circle-stroke-color": "#ffffff",
                        },
                    });

                    map.addLayer({
                        id: "weather-points-label",
                        type: "symbol",
                        source: "weather-points",
                        layout: {
                            "text-field": ["get", "label"], // label 속성 사용
                            "text-size": 12,
                            "text-offset": [0, 0],
                            "text-anchor": "center",
                        },
                        paint: {
                            "text-color": "#ffffff",
                            "text-halo-color": "#000000",
                            "text-halo-width": 1,
                        },
                    });
                }
            } catch (err) {
                console.error("Point API 호출 실패:", err);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, [map, bounds]);

    return null;
};
