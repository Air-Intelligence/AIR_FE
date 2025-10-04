import { useEffect } from "react";

import { pushApi } from "../api/push";
import { userApi } from "../api/user";

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
            } catch (err: any) {
                console.error("푸시 초기화 실패:", err);
                if (err.response) {
                    const data = await err.response.json();

                    // USER_NOT_FOUND인 경우
                    if (data.errorName === "USER_NOT_FOUND") {
                        localStorage.removeItem("userId");
                        const res = await userApi.createUser();
                        const userId = res.content.userId;
                        localStorage.setItem("userId", userId);
                        console.log("신규 유저 생성:", userId);
                    }
                }
            }
        };

        register();
    }, [vapidPublicKey]);
}
