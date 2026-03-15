import React, { useState, useEffect } from "react";
import api from "../../utils/api";

const WeatherNav = ({setData}) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) =>
                    fetchWeather(null, pos.coords.latitude, pos.coords.longitude),
                () => {
                    setError("Location access denied. Showing default: Mumbai");
                    fetchWeather("Mumbai");
                }
            );
        } else {
            fetchWeather("Mumbai");
        }
    }, []);

    // Detect page scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchWeather = async (city, lat, lon) => {
        setLoading(true);
        try {
            const params = lat ? `lat=${lat}&lon=${lon}` : `city=${city}`;
            const res = await api.get(`api/weather/forecast?${params}`);
            setWeather(res.data);
            setData({current : res.data.current, location: res.data.location}); // Pass current weather and location to parent
            setError(null);
        } catch {
            setError("Could not load weather data.");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="text-center py-10 text-green-700 dark:text-green-300">
                Detecting location & Soil conditions...
            </div>
        );

    if (!weather) return null;

    return (
        <div className="w-full text-white">

            {error && (
                <p className="text-center text-red-500 mb-2">{error}</p>
            )}

            {/* ---------- TOP WEATHER (FULL VIEW) ---------- */}
            {!isScrolled && (
                <div className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">

                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        {/* Location + Temp */}
                        <div className="flex items-center gap-4">
                            <img
                                src={weather?.current?.icon?.startsWith("//")
                                    ? `https:${weather.current.icon}`
                                    : (weather?.current?.icon?.length === 3 
                                        ? `https://openweathermap.org/img/wn/${weather.current.icon}@2x.png` 
                                        : weather?.current?.icon)}
                                alt="weather"
                                className="w-12 h-12"
                            />

                            <div>
                                <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                                    {/* Maps to the City, State structure */}
                                    {weather.location.city || weather.location.name}
                                    {weather.location.state ? `, ${weather.location.state}` : ""}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {weather.current.condition}
                                </p>
                            </div>

                            <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                                {weather.current.temp_c || weather.current.temp}°C
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 text-sm text-gray-700 dark:text-gray-300">
                            <div>💧 Humidity: {weather.current.humidity}%</div>
                            <div>💨 Wind: {weather.current.wind_speed} m/s</div>
                        </div>
                    </div>

                    {/* Forecast Cards */}
                    <div className="max-w-7xl mx-auto px-4 pb-4">

                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Few-Day Agricultural Outlook
                        </h3>

                        <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2">

                            {weather.forecast?.map((day) => (
                                <div
                                    key={day.dt || day.date}
                                    className="min-w-[120px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center"
                                >
                                    <p className="font-semibold text-gray-700 dark:text-gray-200">
                                        {new Date((day.dt * 1000) || day.date).toLocaleDateString("en-US", {
                                            weekday: "short",
                                        })}
                                    </p>

                                    <div className="flex justify-center">
                                        <img
                                            src={day.icon?.startsWith("//") 
                                                ? `https:${day.icon}` 
                                                : `https://openweathermap.org/img/wn/${day.icon}.png`}
                                            alt="icon"
                                            className="w-8 h-8"
                                        />
                                    </div>

                                    <p className="text-sm text-gray-700 dark:text-gray-200">
                                        {day.temp_c || day.avgTemp}°
                                    </p>

                                    <p className="text-blue-600 text-xs font-semibold">
                                        🌧 {day.daily_chance_of_rain}%
                                    </p>

                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">
                                        {day.daily_chance_of_rain > 50
                                            ? "Hold Irrigation"
                                            : "Safe to Fertilize"}
                                    </p>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            )}

            {/* ---------- SCROLL NAVBAR (COMPACT) ---------- */}
            {isScrolled && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-white text-gray-700 dark:text-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-700">

                    <div className="flex items-center gap-6 px-4 py-3 overflow-x-auto">

                        {/* Current Weather */}
                        <div className="flex items-center gap-3 min-w-max">
                            <img
                                src={weather.current.icon?.startsWith("//")
                                    ? `https:${weather.current.icon}`
                                    : `https://openweathermap.org/img/wn/${weather.current.icon}.png`}
                                alt="weather"
                                className="w-10 h-10"
                            />

                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {weather.location.city || weather.location.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {weather.current.condition}
                                </p>
                            </div>

                            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                                {weather.current.temp_c || weather.current.temp}°C
                            </div>
                        </div>

                        <div className="text-sm text-gray-700 dark:text-gray-300 min-w-max">
                            💧 {weather.current.humidity}%
                        </div>

                        <div className="text-sm text-gray-700 dark:text-gray-300 min-w-max">
                            💨 {weather.current.wind_speed} m/s
                        </div>

                        {weather.forecast?.map((day) => (
                            <div
                                key={day.dt || day.date}
                                className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 min-w-max"
                            >
                                <p className="text-sm font-semibold">
                                    {new Date((day.dt * 1000) || day.date).toLocaleDateString("en-US", {
                                        weekday: "short",
                                    })}
                                </p>

                                <img
                                    src={day.icon?.startsWith("//") 
                                        ? `https:${day.icon}` 
                                        : `https://openweathermap.org/img/wn/${day.icon}.png`}
                                    alt="icon"
                                    className="w-6 h-6"
                                />

                                <p className="text-sm">
                                    {day.temp_c || day.avgTemp}°
                                </p>

                                <p className="text-blue-600 text-xs">
                                    🌧 {day.daily_chance_of_rain || day.rainChance}%
                                </p>
                            </div>
                        ))}

                    </div>
                </div>
            )}

        </div>
    );
};

export default WeatherNav;