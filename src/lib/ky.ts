import ky from "ky";

// ky instance
export const api = ky.create({
    prefixUrl: (import.meta.env.VITE_PUBLIC_API_URL || "") + "/api/v1",
    timeout: 10000,
    retry: 2,
    headers: {
        "Content-Type": "application/json",
    },
    hooks: {
        afterResponse: [],
        beforeRequest: [],
        beforeError: [],
    },
});
