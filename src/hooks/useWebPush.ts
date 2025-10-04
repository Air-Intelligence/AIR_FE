import { useEffect } from "react";
import { pushApi } from "../api/push";

export function useWebPush(vapidPublicKey: string) {
    useEffect(() => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            console.log("푸시 지원 안 함");
            return;
        }

        const register = async () => {
            try {
                const registration = await navigator.serviceWorker.register("/serviceWorker.js", {
                    scope: "/",
                });
                console.log("Service Worker 등록 완료:", registration);

                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    console.log("알림 권한 거부됨");
                    return;
                }

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: vapidPublicKey,
                });

                console.log("Push 구독 정보:", JSON.stringify(subscription));

                // 타입 단언
                const { endpoint, keys } = subscription.toJSON() as {
                    endpoint: string;
                    keys: { p256dh: string; auth: string };
                };

                await pushApi.saveSubscription({ endpoint, keys });
            } catch (err) {
                console.error("푸시 초기화 실패:", err);
            }
        };

        register();
    }, [vapidPublicKey]);
}
