self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    event.waitUntil(
        self.registration.showNotification(data.title || "알림", {
            body: data.body || "",
            icon: "/icon.png", // 나중에 서비스 아이콘으로 교체
            // image: "/testImage.jpg" // 가능은 함
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
});
t
self.addEventListener("message", (event) => {
    if (event.data?.type === "test-push") {
        const data = event.data.payload;
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/icon.png",
        });
    }
});
