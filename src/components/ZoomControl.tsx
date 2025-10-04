import { cn } from "../lib/utils";

interface ZoomControlProps {
    map: mapboxgl.Map | null;
    className?: string;
    buttonColor?: string;
    dividerColor?: string;
}

/**
 * 맵 확대/축소 버튼 컴포넌트
 * @param map mapboxgl.Map 인스턴스 (필수)
 * @param className 추가 스타일
 * @param buttonColor 버튼 배경색 (기본값 #FFCE48)
 * @param dividerColor 구분선 색상 (기본값 yellow-300)
 */
export const ZoomControl = ({
    map,
    className = "",
    buttonColor = "#FFCE48",
    dividerColor = "#FDE68A",
}: ZoomControlProps) => {
    if (!map) return null;

    const handleZoomIn = () => map.zoomIn();
    const handleZoomOut = () => map.zoomOut();

    return (
        <div
            className={cn(
                `flex flex-col absolute right-4 bottom-8 w-16 h-44 `,
                `rounded-[16px] overflow-hidden shadow-md ${className}`
            )}
        >
            <button
                className="flex-1 text-black text-2xl font-bold flex items-center justify-center bg-[#FFCE48] active:bg-custom-pressed"
                onClick={handleZoomIn}
            >
                +
            </button>
            <div className="h-px" style={{ backgroundColor: dividerColor }} />
            <button
                className="flex-1 text-black text-2xl font-bold flex items-center justify-center bg-[#FFCE48] active:bg-custom-pressed"
                onClick={handleZoomOut}
            >
                −
            </button>
        </div>
    );
};
