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
                lat: body.lat,
                lon: body.lng,
            },
        };

        return await api.put("users/last-coord", { json: payload }).json<UserResponse>();
    },
};
