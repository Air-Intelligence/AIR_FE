import { api } from "../lib/ky";

interface PushSubscriptionDTO {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export const pushApi = {
    saveSubscription: async (subscription: PushSubscriptionDTO) => {
        return api.post("notifications/subscribe", { json: subscription }).json();
    },
};
