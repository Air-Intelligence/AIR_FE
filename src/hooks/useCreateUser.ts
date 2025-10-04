import { useEffect } from "react";
import { userApi } from "../api/user";

export function useCreateUser() {
    useEffect(() => {
        const initUser = async () => {
            const existingUserId = localStorage.getItem("userId");
            if (existingUserId) {
                console.log("이미 유저 있음:", existingUserId);
                return;
            }

            try {
                const res = await userApi.createUser();
                const userId = res.content.userId;
                localStorage.setItem("userId", userId);
                console.log("신규 유저 생성:", userId);
            } catch (err) {
                console.error("유저 생성 실패:", err);
            }
        };

        initUser();
    }, []);
}
