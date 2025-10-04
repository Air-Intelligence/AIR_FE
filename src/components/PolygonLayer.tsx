import { useEffect } from "react";
import polygonSmooth from "@turf/polygon-smooth";
import { featureCollection } from "@turf/helpers";

import { useMapBounds } from "../hooks/useMapBounds";
import { weatherApi } from "../api/weather";

interface PolygonLayerProps {
    map: mapboxgl.Map | null;
}

export const PolygonLayer = ({ map }: PolygonLayerProps) => {
    const bounds = useMapBounds(map);

    useEffect(() => {
        if (!map || !bounds) return;

        const fetchData = async () => {
            try {
                const data = await weatherApi.getPolygon({
                    lowerLat: bounds.southWest.lat,
                    lowerLon: bounds.southWest.lng,
                    upperLat: bounds.northEast.lat,
                    upperLon: bounds.northEast.lng,
                });

                // API 응답에서 GeoJSON 꺼내오기
                const features = data.content.features.map(
                    (f: any) => polygonSmooth(f, { iterations: 3 }).features[0]
                );
                const geoJson = featureCollection(features);

                if (map.getSource("weather-polygon")) {
                    (map.getSource("weather-polygon") as mapboxgl.GeoJSONSource).setData(
                        geoJson as any
                    );
                } else {
                    map.addSource("weather-polygon", {
                        type: "geojson",
                        data: geoJson as any,
                    });

                    map.addLayer({
                        id: "weather-polygon-fill",
                        type: "fill",
                        source: "weather-polygon",
                        paint: {
                            "fill-color": [
                                "step",
                                ["get", "value"],
                                "#ffffff", // 기본값 (0 미만)
                                20,
                                "#ffffff", // 0~19
                                40,
                                "#ff9999", // 20~39
                                60,
                                "#ff5959", // 40~59
                                80,
                                "#ff3030", // 60~79
                                100,
                                "#ff3030", // 80~100
                            ],
                            "fill-opacity": 0.5,
                        },
                    });
                }
            } catch (err) {
                console.error("Polygon API 호출 실패:", err);
            }
        };

        fetchData();
    }, [map, bounds]);

    return null;
};
