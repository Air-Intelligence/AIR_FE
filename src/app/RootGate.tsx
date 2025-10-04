import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export const RootGate = () => {
    const [checked, setChecked] = useState(false);
    const [visited, setVisited] = useState(true);

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited");
        if (!hasVisited) {
            localStorage.setItem("hasVisited", "true");
            setVisited(false);
        }
        setChecked(true);
    }, []);

    if (!checked) return null; // 초기 로딩 중엔 아무것도 안 보여주기

    if (!visited) {
        return <Navigate to="/welcome" replace />;
    }

    // 방문한 적 있으면 기본 children(HomePage) 렌더
    return <Outlet />;
};
