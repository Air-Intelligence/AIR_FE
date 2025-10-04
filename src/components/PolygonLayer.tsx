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

                const features = data.content.features.map(
                    (f: any) => polygonSmooth(f, { iterations: 3 }).features[0]
                );

                // value 구간 정의
                const ranges = [
                    { id: "80-100", min: 80, max: 100, color: "#ff3030" },
                    { id: "60-79", min: 60, max: 79, color: "#ff5959" },
                    { id: "40-59", min: 40, max: 59, color: "#ff9999" },
                    { id: "20-39", min: 20, max: 39, color: "#ffb0b0" },
                    { id: "0-19", min: 0, max: 19, color: "#ffffff" },
                ];

                // value 구간별 source/layer 생성
                ranges.forEach((r) => {
                    const filtered = featureCollection(
                        features.filter(
                            (f: any) => f.properties.value >= r.min && f.properties.value <= r.max
                        )
                    );

                    const sourceId = `weather-polygon-${r.id}`;
                    const layerId = `weather-polygon-fill-${r.id}`;

                    // 기존 source 갱신 or 새로 생성
                    if (map.getSource(sourceId)) {
                        (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(
                            filtered as any
                        );
                    } else {
                        map.addSource(sourceId, { type: "geojson", data: filtered });
                        map.addLayer({
                            id: layerId,
                            type: "fill",
                            source: sourceId,
                            paint: {
                                "fill-color": r.color,
                                "fill-opacity": 0.5,
                            },
                        });
                    }
                });
            } catch (err) {
                console.error("Polygon API 호출 실패:", err);
            }
        };

        fetchData();
    }, [map, bounds]);

    return null;
};
