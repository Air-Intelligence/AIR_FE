import { api } from "../lib/ky";

const userId = localStorage.getItem("userId");

interface PushSubscriptionDTO {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export const pushApi = {
    saveSubscription: async (body: PushSubscriptionDTO) => {
        const payload = {
            userId: userId,
            subscription: {
                endpoint: body.endpoint,
                keys: {
                    p256dh: body.keys.p256dh,
                    auth: body.keys.auth,
                },
            },
        };

        return api.post("notifications/subscribe", { json: payload }).json();
    },
};
