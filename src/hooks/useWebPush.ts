import { useEffect } from "react";

export function useWebPush(vapidPublicKey: string) {
    useEffect(() => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            console.log("푸시 지원 안 함");
            return;
        }

        const register = async () => {
            try {
                const registration = await navigator.serviceWorker.register("/serviceWorker.js");
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

                console.log("Push 구독:", subscription);

                // TODO: subscription을 서버에 POST
                await fetch("/api/save-subscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(subscription),
                });
            } catch (err) {
                console.error("푸시 초기화 실패:", err);
            }
        };

        register();
    }, [vapidPublicKey]);
}
