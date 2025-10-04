import { BottomSheet } from "../../components/BottomSheet";

export const WelcomePage = () => {
    return (
        <div
            className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-between"
            style={{ backgroundImage: "" }}
        >
            <BottomSheet>
                <h2 className="text-center font-bold text-lg mb-4">Recommended guidelines</h2>
                <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-200" />
                        <p className="mt-2 text-sm text-gray-600">KF95 (o)</p>
                    </div>
                    <div>
                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-200" />
                        <p className="mt-2 text-sm text-gray-600">N95 (o)</p>
                    </div>
                    <div>
                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-200" />
                        <p className="mt-2 text-sm text-gray-600">test</p>
                    </div>
                    <div>
                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-200" />
                        <p className="mt-2 text-sm text-gray-600">test</p>
                    </div>
                </div>
            </BottomSheet>
            <div className="text-3xl font-bold mt-20">Service name</div>
            <p className="px-6 text-center text-sm">
                NASA’s Tropospheric Emissions: Monitoring of Pollution (TEMPO) mission is
                revolutionizing air quality monitoring across North America by enabling better
                forecasts and reducing pollutant exposure
            </p>
            <div className="space-y-4 mb-16 w-3/4">
                <button className="w-full py-3 rounded-xl bg-black text-white font-bold">
                    text
                </button>
                <button className="w-full py-3 rounded-xl bg-gray-500 text-white font-bold">
                    text
                </button>
            </div>
        </div>
    );
};
