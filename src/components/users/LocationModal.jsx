import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function LocationModal({ isOpen, onClose, onConfirm, onDetect, t }) {

    const [position, setPosition] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    function ClickHandler() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
            },
        });
        return position ? <Marker position={position} /> : null;
    }

    function RecenterMap({ pos }) {
        const map = useMap();
        useEffect(() => {
            if (pos) map.flyTo(pos, 13);
        }, [pos, map]);
        return null;
    }

    // 🔎 Search Location using OpenStreetMap Nominatim
    const handleSearch = async () => {
        if (!searchQuery) return;

        try {
            setLoading(true);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
            );

            const data = await response.json();

            if (data.length === 0) {
                alert("Location not found");
                return;
            }

            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            setPosition({ lat, lng: lon });

        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">

                <h3 className="text-2xl font-bold mb-2 dark:text-white text-center">
                    📍 {t("Set Location")}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                    Search by Country, State, District, Village or click on map.
                </p>

                {/* 🔎 Search Bar */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Search location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-xl dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                {/* Map */}
                <div className="h-80 w-full rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <ClickHandler />
                        <RecenterMap pos={position} />
                        {position && <Marker position={position} />}
                    </MapContainer>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <button
                        type="button"
                        onClick={() => onDetect((coords) => setPosition(coords))}
                        className="bg-green-100 text-green-700 font-semibold py-3 rounded-xl hover:bg-green-200 transition"
                    >
                        🛰️ Detect GPS
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (!position) return;
                            onConfirm(position);
                        }}
                        disabled={!position}
                        className={`font-semibold py-3 rounded-xl text-white transition ${
                            position
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Confirm & Signup
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                    Cancel
                </button>

            </div>
        </div>
    );
}
