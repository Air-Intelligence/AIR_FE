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

export interface WeatherPointResponse {
    statusCode: number;
    content: {
        type: "FeatureCollection";
        features: Array<{
            type: "Feature";
            geometry: {
                type: "Point";
                coordinates: [number, number]; // [lon, lat]
            };
            properties: {
                value: number;
                [key: string]: any;
            };
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
    getPoints: async (params: {
        lowerLat: number;
        lowerLon: number;
        upperLat: number;
        upperLon: number;
    }): Promise<WeatherPointResponse> => {
        return await api
            .get("weathers/point", {
                searchParams: {
                    "lower-lat": params.lowerLat,
                    "lower-lon": params.lowerLon,
                    "upper-lat": params.upperLat,
                    "upper-lon": params.upperLon,
                },
            })
            .json<WeatherPointResponse>();
    },
};
