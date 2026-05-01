import GoogleLangTran from './language/GoogleLangTran'
import React, { useState, useEffect } from "react";
import AgriLoader from "./commonComponent/AgriLoader";
import api from "../utils/api";

import WeatherNav from "./home/WeatherNav";
import BestCrops from "./home/BestCrops";
import CropDetails from "./home/CropDetails";
import Fertilizers from "./home/Fertilizers";
import Pesticides from "./home/Pesticides";
import CropHealth from "./home/CropHealth";
import RelatedCrops from "./home/RelatedCrops";
import SeasonalCrops from "./home/SeasonalCrops";
import ServiceHub from "./home/ServiceHub";
import EnvironmentalSettings from "./home/EnvironmentalSettings";
import Footer from "./Footer"

const Home = () => {

    // Helper to handle session-like cookies
    const setSessionCookie = (name, value) => {
        document.cookie = `${name}=${value}; path=/; max-age=86400`; // 24 hour expiry
    };
    const getSessionCookie = (name, defaultValue) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return defaultValue;
    };

    const [crops, setCrops] = useState([]);
    const [weather, setWeather] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [fertilizers, setFertilizers] = useState([]);
    const [pesticides, setPesticides] = useState([]);
    const [related, setRelated] = useState([]);
    const [seasonal, setSeasonal] = useState([]);
    const [health, setHealth] = useState(null);
    // Initialize state from cookies or defaults
    const [ manualModeForm, setManualModeForm ] = useState({
        rainfall: Number(getSessionCookie("rainfall", 1400)),
        phLevel: Number(getSessionCookie("phLevel", 6.5)),
        soilType: getSessionCookie("soilType", "loamy"),
        n : Number(getSessionCookie("n", 80)),
        p : Number(getSessionCookie("p", 40)),
        k : Number(getSessionCookie("k", 40))
    });
    // const [rainfall, setRainfall] = useState(Number(getSessionCookie("rainfall", 1400)));
    // const [phLevel, setPhLevel] = useState(Number(getSessionCookie("phLevel", 6.5)));
    // const [soilType, setSoilType] = useState(getSessionCookie("soilType", "loamy"));
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const handleSaveSettings = (newData) => {
        setManualModeForm({ ...manualModeForm, rainfall: newData.rainfall, phLevel: newData.phLevel, soilType: newData.soilType, n: newData.n, p: newData.p, k: newData.k });

        // Save to Cookies
        setSessionCookie("rainfall", newData.rainfall);
        setSessionCookie("phLevel", newData.phLevel);
        setSessionCookie("soilType", newData.soilType);
        setSessionCookie("n", newData.n);
        setSessionCookie("p", newData.p);
        setSessionCookie("k", newData.k);

        // Re-run predictions with new data
        if (weather) loadPredictions();
    };

    useEffect(() => {
        const initHome = async () => {
            setIsInitialLoading(true);
            await Promise.all([
                loadSeasonal(),
                weather ? loadPredictions() : Promise.resolve()
            ]);
            setIsInitialLoading(false);
        };

        initHome();
    }, []);

    // 1. Logic to determine Season based on Current Month
    const getCurrentSeason = () => {
        const month = new Date().getMonth() + 1; // 1-12
        // Kharif: June to Oct
        if (month >= 6 && month <= 10) return "kharif";
        // Rabi: Nov to March
        if (month >= 11 || month <= 3) return "rabi";
        // Zaid: April to May
        return "zaid";
    };

    // Initialize seasonal crops immediately
    useEffect(() => {
        loadSeasonal();
    }, []);

    // 2. Trigger predictions ONLY when weather data is updated by WeatherNav
    useEffect(() => {
        if (weather) {
            loadPredictions();
        }
    }, [weather]);

    const loadPredictions = async () => {
        setLoading(true);
        try {
            const res = await api.post("/api/crops/predict", {
                temp: weather?.current?.temp_c || 25,
                humidity: weather?.current?.humidity || 70,
                rainfall: manualModeForm.rainfall,
                phLevel: manualModeForm.phLevel,
                soilType: manualModeForm.soilType,
                n: manualModeForm.n,
                p: manualModeForm.p,
                k: manualModeForm.k
                // n: 80, p: 40, k: 40
            });
            setCrops(res.data || []);
        } catch (err) {
            setError("Failed to generate recommendations");
        } finally {
            setLoading(false);
        }
    }

    const loadSeasonal = async () => {
        try {
            const seasonName = getCurrentSeason();
            // Using query params or dynamic path as per your backend route
            const res = await api.get(`/api/crops/season/${seasonName}`);
            setSeasonal(res.data || []);
        } catch (err) {
            console.error("Seasonal crops error:", err);
        }
    };

    const selectCrop = async (crop) => {
        try {
            setLoading(true);
            setSelectedCrop(crop);

            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Use 'smooth' for a nice transition or 'instant' for immediate jump
            });

            const cropId = crop?.data?._id || crop?.id || crop?._id;
            if (!cropId) return;

            const [fRes, pRes, rRes, hRes] = await Promise.all([
                api.get(`/api/crops/${cropId}/fertilizers`),
                api.get(`/api/crops/${cropId}/pesticides`),
                api.get(`/api/crops/${cropId}/related`),
                api.post("/api/crops/health", {
                    cropId,
                    n: manualModeForm.n,
                    p: manualModeForm.p,
                    k: manualModeForm.k,
                    rainfall: manualModeForm.rainfall
                })
            ]);

            setFertilizers(fRes.data || []);
            setPesticides(pRes.data || []);
            setRelated(rRes.data || []);
            setHealth(hRes.data || null);

        } catch (err) {
            console.error("Crop selection error:", err);
            setError("Failed to load crop details");
        } finally {
            setLoading(false);
        }
    };

    {/* Loading */ }
    {
        loading && (
            <AgriLoader contentHeader=" Agricultural" />
        )
    }

    return (
        <div className="min-h-screen bg-green-50 dark:bg-gray-900 capitalize">

            {
                (isInitialLoading || (loading && !crops.length)) && (
                    <AgriLoader contentHeader="Analyzing Agricultural Data..." />
                )
            }
            {/* Nav passes data to setWeather state */}
            <WeatherNav setData={setWeather} setIsSettingsOpen={setIsSettingsOpen} />
            {
                error && (
                    <div className="text-center text-red-500 py-4 bg-red-50 border-b border-red-100">
                        {error}
                    </div>
                )
            }
            {
                !isInitialLoading && (
                    <div className="max-w-7xl mx-auto px-4 pt-6 pb-10 grid lg:grid-cols-3 gap-6">
                        {/* Left Side: Recommendations and Seasons */}
                        <div className="lg:col-span-1 space-y-6">
                            <BestCrops
                                crops={crops}
                                selectCrop={selectCrop}
                                loading={loading}
                            />
                            <SeasonalCrops
                                crops={seasonal}
                                selectCrop={selectCrop}
                                season={getCurrentSeason()}
                            />
                        </div>

                        {/* Right Side: Details and Tools */}
                        <div className="lg:col-span-2 space-y-6">
                            {selectedCrop ? (
                                <>
                                    <CropDetails crop={selectedCrop} />

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Fertilizers fertilizers={fertilizers} />
                                        <Pesticides pesticides={pesticides} />
                                    </div>

                                    <CropHealth health={health} />
                                    <RelatedCrops crops={related} selectCrop={selectCrop} />
                                </>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-sm text-center border-2 border-dashed border-green-200">
                                    <ServiceHub />
                                    {/* <p className="text-gray-500">
                                {loading ? "Analyzing area data..." : "Please select a crop from the left to view specific farming data."}
                            </p> */}
                                </div>
                            )}

                            {/* <div className="mt-10">
                            <GoogleLangTran />
                        </div> */}
                        </div>
                    </div>
                )
            }
            {/* 2. The New Floating Form Component */}
            <EnvironmentalSettings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleSaveSettings}
                manualModeForm={manualModeForm}
                setManualModeForm={setManualModeForm}
                // initialData={{ rainfall: manualModeForm.rainfall, phLevel: manualModeForm.phLevel, soilType: manualModeForm.soilType }}
            />
            <Footer />
        </div >
    );
};

export default Home;