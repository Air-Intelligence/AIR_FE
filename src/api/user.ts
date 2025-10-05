import { api } from "../lib/ky";

const userId = localStorage.getItem("userId");

export interface UserResponse {
    statusCode: number;
    content: {
        userId: string;
        coord: {
            lat: number;
            lon: number;
        };
        warningLevel: "SAFE" | "READY" | "WARNING" | "DANGER" | "RUN";
    };
    timestamp: string;
}

export interface CreateUserResponse {
    statusCode: number;
    content: {
        userId: string;
    };
    timestamp: string;
}

export const userApi = {
    createUser: async (): Promise<CreateUserResponse> => {
        return await api.post("users").json<CreateUserResponse>();
    },

    updateLastCoord: async (body: { lat: number; lng: number }): Promise<UserResponse> => {
        const payload = {
            userId: userId,
            coord: {
                // lat: body.lat,
                // lon: body.lng,
                lat: 37.42123288185227,
                lon: -122.06577531931865,
            },
        };

        return await api.put("users/last-coord", { json: payload }).json<UserResponse>();
    },
};
