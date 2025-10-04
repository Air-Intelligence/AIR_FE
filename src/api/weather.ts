import { api } from "../lib/ky";

export interface WeatherPolygonResponse {
    statusCode: number;
    content: {
        type: string;
        features: Array<{
            type: string;
            geometry: {
                type: string;
                coordinates: any;
            };
            properties: Record<string, any>;
        }>;
    };
    timestamp: string;
}

export const weatherApi = {
    getPolygon: async (params: {
        lowerLat: number;
        lowerLon: number;
        upperLat: number;
        upperLon: number;
    }): Promise<WeatherPolygonResponse> => {
        const { lowerLat, lowerLon, upperLat, upperLon } = params;

        return await api
            .get("weathers/polygon", {
                searchParams: {
                    "lower-lat": lowerLat,
                    "lower-lon": lowerLon,
                    "upper-lat": upperLat,
                    "upper-lon": upperLon,
                },
            })
            .json<WeatherPolygonResponse>();
    },
};
