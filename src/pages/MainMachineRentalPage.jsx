import React, { useState, useEffect } from "react";
import ListOfMachines from "../components/machine-rentals/ListOfMachines";
import RentedMachines from "../components/machine-rentals/RentedMachines";
import AvailableMachines from "../components/machine-rentals/AvailableMachines";
import FilterNavbar from "../components/machine-rentals/FilterNavbar";
import api from "../utils/api";
import Footer from "../components/Footer";

function MainMachineRentalPage({ userAddress }) {
    const [availableMachinesList, setAvailableMachinesList] = useState([]);
    const [machinesList, setMachinesList] = useState([]);
    const [rentalMachines, setRentalMachines] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔥 Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [category, setCategory] = useState("");
    const [priceRange, setPriceRange] = useState("");

    // ✅ Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [availableRes, allRes, rentedRes] = await Promise.all([
                    api.get("/api/machine-rental/available-machines"),
                    api.get("/api/machine-rental/list-machines"),
                    api.get("/api/machine-rental/rental-history"),
                ]);

                setAvailableMachinesList(availableRes.data.data || availableRes.data);
                setMachinesList(allRes.data.data || allRes.data);
                setRentalMachines(rentedRes.data.data || rentedRes.data);

                console.log('availableRes.data.data', availableRes.data.data)

                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load data");
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // 💰 Price Filter
    const checkPriceRange = (price) => {
        const p = Number(price);

        if (!priceRange) return true;

        if (priceRange === "5000+") return p > 5000;

        const [min, max] = priceRange.split("-").map(Number);
        return p >= min && p <= max;
    };

    // 🔥 FULL FILTER LOGIC
    const applyFilters = (list) => {
        return list.filter((item) => {
            const text = searchTerm.toLowerCase();

            const safe = (val) => {
                if (!val) return "";
                if (typeof val === "object") return JSON.stringify(val).toLowerCase();
                return String(val).toLowerCase();
            };

            const name = safe(item.machineName);
            const type = safe(item.machineType);
            const model = safe(item.machineModel);
            const area = safe(item.machineWorkingArea);
            const price = safe(item.rentalPricePerHour);
            const status = safe(item.machineStatus);

            // ✅ OWNER FIX
            const ownerName = safe(item.machineOwner?.username);
            const ownerMobile = safe(item.machineOwner?.MobileNum);

            const location = safe(
                `${item.location?.city || ""} ${item.location?.state || ""}`
            );

            // 🔍 SEARCH ALL
            const matchesSearch =
                name.includes(text) ||
                type.includes(text) ||
                model.includes(text) ||
                area.includes(text) ||
                price.includes(text) ||
                status.includes(text) ||
                location.includes(text) ||
                ownerName.includes(text) ||
                ownerMobile.includes(text);

            // 📂 Category = machineType
            const matchesCategory = category
                ? type.includes(category.toLowerCase())
                : true;

            // 💰 Price
            const matchesPrice = checkPriceRange(item.rentalPricePerHour);

            return matchesSearch && matchesCategory && matchesPrice;
        });
    };

    const filteredAll = applyFilters(machinesList);

    const filteredAvailable =
        filterType === "all" || filterType === "available"
            ? applyFilters(availableMachinesList)
            : [];

    const filteredRented =
        filterType === "all" || filterType === "rented"
            ? applyFilters(rentalMachines)
            : [];

    return (
        <div className="text-black dark:text-white p-4">

            {/* 🔥 Filter Navbar */}
            <FilterNavbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
                category={category}
                setCategory={setCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
            />

            {/* 📦 All Machines */}
            <ListOfMachines
                userAddress={userAddress}
                machinesList={filteredAll}
                isLoading={isLoading}
                error={error}
            />

            {/* 🚜 Rented */}
            {filterType !== "available" && (
                <RentedMachines
                    userAddress={userAddress}
                    rentalMachines={filteredRented}
                    isLoading={isLoading}
                    error={error}
                />
            )}

            {/* ✅ Available */}
            {filterType !== "rented" && (
                <AvailableMachines
                    userAddress={userAddress}
                    availableMachinesList={filteredAvailable}
                    isLoading={isLoading}
                    error={error}
                />
            )}
            <Footer />
        </div>
    );
}

export default MainMachineRentalPage;