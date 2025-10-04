import { useEffect } from "react";
import { useMapBounds } from "../hooks/useMapBounds";
import { weatherApi } from "../api/weather";

interface PolygonLayerProps {
    map: mapboxgl.Map | null;
}

const normalizePolygon = (geoJson: any) => {
    if (geoJson.type === "FeatureCollection") {
        return {
            ...geoJson,
            features: geoJson.features.map((f: any) => {
                if (f.geometry?.type === "Polygon") {
                    const coords = f.geometry.coordinates;

                    const wrapped =
                        coords.length && typeof coords[0][0] === "number" ? [coords] : coords;
                    return {
                        ...f,
                        geometry: {
                            ...f.geometry,
                            coordinates: wrapped,
                        },
                    };
                }
                return f;
            }),
        };
    }
    return geoJson;
};

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
                const rawGeoJson = data.content;
                const geoJson = normalizePolygon(rawGeoJson);

                console.log(geoJson.features[0].geometry.coordinates);
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
                            "fill-color": "#FF0000",
                            "fill-opacity": 0.3,
                        },
                    });

                    map.addLayer({
                        id: "weather-polygon-outline",
                        type: "line",
                        source: "weather-polygon",
                        paint: {
                            "line-color": "#FF0000",
                            "line-width": 2,
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
