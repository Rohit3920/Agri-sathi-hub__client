import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

const MachineList = () => {
    const [machines, setMachines] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedMachine, setSelectedMachine] = useState(null);

    useEffect(() => {
        api.get("/api/machine-rental/list-machines")
            .then(res => setMachines(res.data.data))
            .catch(() => console.error("Failed to fetch machines"));
    }, []);

    // ✅ DELETE FUNCTION
    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/machine-rental/delete/${id}`);

            // remove from UI
            setMachines(prev => prev.filter(m => m._id !== id));

            toast.success("Machine deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete machine");
        }
    };

    // ✅ FILTER + SEARCH
    const filteredMachines = machines.filter((m) => {
        const fullText = `
            ${m.machineName}
            ${m.machineType}
            ${m.machineModel}
            ${m.machineStatus}
            ${m.machineWorkingArea}
            ${m.location?.city}
            ${m.location?.state}
        `.toLowerCase();

        const matchSearch = fullText.includes(search.toLowerCase());
        const matchFilter =
            statusFilter === "all" || m.machineStatus === statusFilter;

        return matchSearch && matchFilter;
    });

    // ✅ COUNTS
    const total = machines.length;
    const available = machines.filter(m => m.machineStatus === "available").length;
    const rented = machines.filter(m => m.machineStatus === "rented").length;
    const unavailable = machines.filter(m => m.machineStatus === "unavailable").length;

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
                    Machine Management
                </h2>

                {/* SEARCH + FILTER */}
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search machines..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="unavailable">Unavailable</option>
                        <option value="under_maintenance">Maintenance</option>
                        <option value="working">Working</option>
                    </select>
                </div>
            </div>

            {/* COUNTS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center">
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Total</p>
                    <h3 className="text-2xl font-bold text-black dark:text-white">{total}</h3>
                </div>

                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-xl text-center">
                    <p className="text-sm text-green-700 dark:text-green-300">Available</p>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-white">{available}</h3>
                </div>

                <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-xl text-center">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Rented</p>
                    <h3 className="text-2xl font-bold text-yellow-800 dark:text-white">{rented}</h3>
                </div>

                <div className="bg-red-100 dark:bg-red-900 p-4 rounded-xl text-center">
                    <p className="text-sm text-red-700 dark:text-red-300">Unavailable</p>
                    <h3 className="text-2xl font-bold text-red-800 dark:text-white">{unavailable}</h3>
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left">

                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Machine</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Model</th>
                            <th className="px-4 py-3">Price/hr</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Options</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredMachines.length > 0 ? (
                            filteredMachines.map((m) => (
                                <tr
                                    key={m._id}
                                    onClick={() => setSelectedMachine(m)}
                                    className="border-t hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer transition"
                                >
                                    <td className="px-4 py-3">
                                        <img
                                            src={m.machineImage}
                                            className="w-12 h-12 object-cover rounded-lg border"
                                        />
                                    </td>

                                    <td className="px-4 py-3 font-semibold">
                                        {m.machineName}
                                    </td>

                                    <td className="px-4 py-3">{m.machineType}</td>

                                    <td className="px-4 py-3">{m.machineModel}</td>

                                    <td className="px-4 py-3 text-green-600 font-semibold">
                                        ₹{m.rentalPricePerHour}
                                    </td>

                                    <td className="px-4 py-3 capitalize">
                                        {m.machineStatus}
                                    </td>

                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                        {m.location?.city}, {m.location?.state}
                                    </td>

                                    {/* OPTIONS */}
                                    <td className="px-4 py-3 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedMachine(m);
                                            }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(m._id);
                                            }}
                                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-6 text-gray-500">
                                    No machines found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {selectedMachine && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[90%] max-w-lg shadow-xl relative">

                        <button
                            onClick={() => setSelectedMachine(null)}
                            className="absolute top-2 right-3 text-xl"
                        >
                            ✖
                        </button>

                        <img
                            src={selectedMachine.machineImage}
                            className="w-full h-48 object-cover rounded mb-4"
                        />

                        <h3 className="text-xl font-bold mb-2">
                            {selectedMachine.machineName}
                        </h3>

                        <p><strong>Type:</strong> {selectedMachine.machineType}</p>
                        <p><strong>Model:</strong> {selectedMachine.machineModel}</p>
                        <p><strong>Status:</strong> {selectedMachine.machineStatus}</p>
                        <p><strong>Price:</strong> ₹{selectedMachine.rentalPricePerHour}/hr</p>
                        <p><strong>Area:</strong> {selectedMachine.machineWorkingArea}</p>
                        <p><strong>Description:</strong> {selectedMachine.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MachineList;