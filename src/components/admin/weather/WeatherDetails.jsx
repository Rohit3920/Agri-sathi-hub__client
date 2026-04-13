import React, { useEffect, useState } from "react";
import api from "../../../utils/api";

const WeatherDetails = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(null, pos.coords.latitude, pos.coords.longitude),
                () => fetchWeather("Pune")
            );
        } else {
            fetchWeather("Pune");
        }
    }, []);

    const fetchWeather = async (city, lat, lon) => {
        setLoading(true);
        try {
            const params = lat ? `lat=${lat}&lon=${lon}` : `city=${city}`;
            const res = await api.get(`/api/weather/forecast?${params}`);
            setWeather(res.data);
            setError("");
        } catch {
            setError("Failed to load weather data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900 text-green-600 text-xl">
                Loading weather...
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-white p-6">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto mb-10">
                <h1 className="text-4xl font-bold text-green-600 mb-2">
                    Weather Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Real-time agricultural weather insights
                </p>
            </div>

            {/* CURRENT WEATHER */}
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-10">

                {/* LEFT */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col justify-center items-center text-center">

                    <img
                        src={weather.current.icon?.startsWith("//")
                            ? `https:${weather.current.icon}`
                            : `https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
                        alt="weather"
                        className="w-24 h-24"
                    />

                    <h2 className="text-2xl font-semibold mt-3">
                        {weather.location.city || weather.location.name}
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400">
                        {weather.current.condition}
                    </p>

                    <div className="text-5xl font-bold text-green-600 mt-4">
                        {weather.current.temp_c || weather.current.temp}°C
                    </div>
                </div>

                {/* RIGHT */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 grid grid-cols-2 gap-6 text-center">

                    <Stat label="Humidity" value={`${weather.current.humidity}%`} />
                    <Stat label="Wind Speed" value={`${weather.current.wind_speed} m/s`} />
                    <Stat label="Pressure" value={`${weather.current.pressure || "--"} hPa`} />
                    <Stat label="Feels Like" value={`${weather.current.feelslike_c || "--"}°C`} />

                </div>
            </div>

            {/* FORECAST */}
            <div className="max-w-7xl mx-auto">

                <h2 className="text-2xl font-bold mb-6 text-green-600">
                    7-Day Forecast
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">

                    {weather.forecast?.map((day) => (
                        <div
                            key={day.dt || day.date}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg text-center hover:scale-105 transition"
                        >
                            <p className="font-semibold mb-2">
                                {new Date((day.dt * 1000) || day.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                })}
                            </p>

                            <img
                                src={day.icon?.startsWith("//")
                                    ? `https:${day.icon}`
                                    : `https://openweathermap.org/img/wn/${day.icon}.png`}
                                alt="icon"
                                className="w-12 h-12 mx-auto"
                            />

                            <p className="text-lg font-bold mt-2">
                                {day.temp_c || day.avgTemp}°
                            </p>

                            <p className="text-blue-600 text-sm">
                                🌧 {day.daily_chance_of_rain}%
                            </p>

                            <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 italic">
                                {day.daily_chance_of_rain > 50
                                    ? "Avoid irrigation"
                                    : "Good for farming"}
                            </p>
                        </div>
                    ))}

                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="text-center mt-6 text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
};

export default WeatherDetails;


// ✅ SMALL COMPONENT
const Stat = ({ label, value }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
            <h3 className="text-xl font-bold text-green-600">{value}</h3>
        </div>
    );
};