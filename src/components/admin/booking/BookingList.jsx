import React, { useEffect, useState } from "react";
import api from "../../../utils/api"; 
import { Search, Tractor, Hammer, Clock, Eye, Trash2, Calendar, IndianRupee, MapPin, User, CheckCircle, Users } from "lucide-react";
import { toast } from "react-toastify";

const BookingList = () => {
    const [activeTab, setActiveTab] = useState("machines");
    const [machineBookings, setMachineBookings] = useState([]);
    const [laborHires, setLaborHires] = useState([]);
    const [workerGroups, setWorkerGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [machineRes, laborRes, groupRes] = await Promise.all([
                api.get("/api/machine-rental/all-requests"),
                api.get("/api/labor/hire"),
                api.get("/api/labor/worker-groups")
            ]);
            setMachineBookings(machineRes.data.data);
            setLaborHires(laborRes.data);
            setWorkerGroups(groupRes.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            let endpoint = "";
            if (activeTab === "machines") endpoint = `/api/admin/delete-machine-booking/${id}`;
            else if (activeTab === "labor") endpoint = `/api/admin/delete-labor-hire/${id}`;
            else endpoint = `/api/labor/worker-groups/${id}`;

            await api.delete(endpoint);
            
            if (activeTab === "machines") setMachineBookings(prev => prev.filter(item => item._id !== id));
            else if (activeTab === "labor") setLaborHires(prev => prev.filter(item => item._id !== id));
            else setWorkerGroups(prev => prev.filter(item => item._id !== id));
            
            toast.success("Record removed");
        } catch (error) {
            toast.error("Failed to delete record");
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            accepted: "bg-blue-100 text-blue-700 border-blue-200",
            completed: "bg-green-100 text-green-700 border-green-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
            cancelled: "bg-gray-100 text-gray-700 border-gray-200",
            startWork: "bg-purple-100 text-purple-700 border-purple-200",
            true: "bg-green-100 text-green-700 border-green-200",
            false: "bg-red-100 text-red-700 border-red-200",
        };
        const displayStatus = status === true ? "Available" : status === false ? "Busy" : status;
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[status] || styles.pending}`}>
                {displayStatus}
            </span>
        );
    };

    const getFilteredData = () => {
        let data = [];
        if (activeTab === "machines") data = machineBookings;
        else if (activeTab === "labor") data = laborHires;
        else data = workerGroups;

        return data.filter((item) => {
            const matchesSearch = activeTab === "machines" 
                ? (item.machineId?.name || "Machine").toLowerCase().includes(search.toLowerCase())
                : activeTab === "labor" 
                ? (item.workType || "").toLowerCase().includes(search.toLowerCase())
                : (item.groupName || "").toLowerCase().includes(search.toLowerCase());
            
            const matchesFilter = statusFilter === "all" || item.status === statusFilter || (activeTab === "groups" && statusFilter === "all");
            return matchesSearch && matchesFilter;
        });
    };

    const filteredData = getFilteredData();

    const stats = {
        totalMachines: machineBookings.length,
        pendingMachines: machineBookings.filter(b => b.status === 'pending').length,
        totalLabor: laborHires.length,
        totalGroups: workerGroups.length
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Agri Sathi Dashboard</h2>
                    <p className="text-sm text-gray-500">Managing Machines, Labors, and Worker Groups</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>
                    {activeTab !== "groups" && (
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="startWork">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold">Machine Bookings</p>
                    <h3 className="text-xl font-bold text-blue-600">{stats.totalMachines}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-yellow-500 uppercase font-bold">Pending Actions</p>
                    <h3 className="text-xl font-bold text-yellow-600">{stats.pendingMachines}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold">Labor Hires</p>
                    <h3 className="text-xl font-bold text-purple-600">{stats.totalLabor}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-green-500 uppercase font-bold">Worker Groups</p>
                    <h3 className="text-xl font-bold text-green-600">{stats.totalGroups}</h3>
                </div>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab("machines")}
                    className={`px-6 py-2 flex items-center gap-2 font-medium transition-colors ${activeTab === "machines" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"}`}
                >
                    <Tractor size={18} /> Machines
                </button>
                <button
                    onClick={() => setActiveTab("labor")}
                    className={`px-6 py-2 flex items-center gap-2 font-medium transition-colors ${activeTab === "labor" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"}`}
                >
                    <Hammer size={18} /> Labor Hires
                </button>
                <button
                    onClick={() => setActiveTab("groups")}
                    className={`px-6 py-2 flex items-center gap-2 font-medium transition-colors ${activeTab === "groups" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"}`}
                >
                    <Users size={18} /> Worker Groups
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">
                                {activeTab === "machines" ? "Machine" : activeTab === "labor" ? "Work Type" : "Group Name"}
                            </th>
                            <th className="px-6 py-4">
                                {activeTab === "groups" ? "Leader" : "Farmer"}
                            </th>
                            <th className="px-6 py-4">
                                {activeTab === "groups" ? "Wage/Day" : "Duration"}
                            </th>
                            <th className="px-6 py-4">
                                {activeTab === "machines" ? "Total Cost" : activeTab === "labor" ? "Hire Type" : "Availability"}
                            </th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                                {activeTab === "machines" ? <Tractor size={20} /> : activeTab === "labor" ? <Hammer size={20} /> : <Users size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    {activeTab === "machines" ? (item.machineId?.name || "Machine") : activeTab === "labor" ? item.workType : item.groupName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ID: {item._id.slice(-6)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium dark:text-gray-200">
                                        {activeTab === "groups" ? (item.leaderId?.username || "N/A") : (item.farmerId?.username || "N/A")}
                                    </td>
                                    <td className="px-6 py-4">
                                        {activeTab === "groups" ? (
                                            <span className="text-sm">₹{item.groupWagePerDay}</span>
                                        ) : (
                                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                <Clock size={14} /> {activeTab === "machines" ? item.totalDays : item.days} Days
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {activeTab === "machines" ? (
                                            <span className="font-bold text-green-600">₹{item.totalCost}</span>
                                        ) : activeTab === "labor" ? (
                                            <span className="capitalize text-sm">{item.hireType}</span>
                                        ) : (
                                            <StatusBadge status={item.availability} />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {activeTab !== "groups" ? <StatusBadge status={item.status} /> : "Active"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedItem({ type: activeTab, data: item })}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="relative h-24 bg-green-600 flex items-center justify-center">
                            <h3 className="text-white text-xl font-bold">Details View</h3>
                            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-white hover:bg-white/20 p-1 rounded-full">✕</button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                    <span className="text-gray-500 text-sm">Record ID</span>
                                    <span className="font-mono text-xs dark:text-white">{selectedItem.data._id}</span>
                                </div>
                                
                                {selectedItem.type === 'machines' && (
                                    <>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                            <span className="text-gray-500 text-sm">Provider</span>
                                            <span className="font-semibold dark:text-white">{selectedItem.data.providerId?.username}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                            <span className="text-gray-500 text-sm">Selected Parts</span>
                                            <span className="text-sm dark:text-white">{selectedItem.data.selectedParts?.join(", ") || "None"}</span>
                                        </div>
                                    </>
                                )}

                                {selectedItem.type === 'groups' && (
                                    <>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                            <span className="text-gray-500 text-sm">Skills</span>
                                            <span className="text-sm dark:text-white">{selectedItem.data.skills?.join(", ")}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                            <span className="text-gray-500 text-sm">Member Count</span>
                                            <span className="text-sm dark:text-white">{selectedItem.data.members?.length || 0}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-full mt-8 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;