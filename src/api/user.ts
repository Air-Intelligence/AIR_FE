import { api } from "../lib/ky";

export interface UserResponse {
    statusCode: number;
    content: unknown;
    timestamp: string;
}

export const userApi = {
    createUser: async (): Promise<UserResponse> => {
        return await api.post("users").json<UserResponse>();
    },

    updateLastCoord: async (body: { lat: number; lng: number }): Promise<UserResponse> => {
        return await api.put("users/last-coord", { json: body }).json<UserResponse>();
    },
};
