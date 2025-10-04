self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    event.waitUntil(
        self.registration.showNotification(data.title || "알림", {
            body: data.body || "",
            icon: "/icon.png",
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
});

self.addEventListener("message", (event) => {
    if (event.data?.type === "test-push") {
        const data = event.data.payload;
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/icon.png",
        });
    }
});
