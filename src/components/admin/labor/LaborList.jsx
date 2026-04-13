import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Search, Users, User, Trash2, Eye, MapPin, Phone, Briefcase, Calendar } from "lucide-react";
import { toast } from "react-toastify";

const LaborList = () => {
    const [workers, setWorkers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [activeTab, setActiveTab] = useState("workers"); // 'workers' or 'groups'
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [workerRes, groupRes] = await Promise.all([
                api.get("/api/labor/workers/available"),
                api.get("/api/labor/worker-groups")
            ]);
            setWorkers(workerRes.data);
            setGroups(groupRes.data);
        } catch (error) {
            console.error("Failed to fetch labor data", error);
            toast.error("Failed to load data");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;
        try {
            const endpoint = activeTab === "workers" 
                ? `/api/labor/delete-worker/${id}` 
                : `/api/labor/delete-group/${id}`;
            
            await api.delete(endpoint);

            if (activeTab === "workers") {
                setWorkers(prev => prev.filter(item => item._id !== id));
            } else {
                setGroups(prev => prev.filter(item => item._id !== id));
            }

            toast.success(`${activeTab === "workers" ? "Worker" : "Group"} deleted successfully`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete item");
        }
    };

    // Helper to extract address safely (handles both array and object structures)
    const getAddress = (userObj) => {
        if (!userObj?.address) return "Address not provided";
        const addr = Array.isArray(userObj.address) ? userObj.address[0] : userObj.address;
        if (!addr?.city || !addr?.state) return "Address incomplete";
        return `${addr.city}, ${addr.state}`;
    };

    const currentData = activeTab === "workers" ? workers : groups;

    const filteredData = currentData.filter((item) => {
        const name = activeTab === "workers" ? item.userId?.username : item.groupName;
        const skills = item.skills?.join(" ") || "";
        const addressStr = activeTab === "workers" ? getAddress(item.userId) : getAddress(item.leaderId);

        const matchesSearch = `${name} ${skills} ${addressStr}`.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = statusFilter === "all" || 
            (statusFilter === "available" && item.availability) || 
            (statusFilter === "unavailable" && !item.availability);

        return matchesSearch && matchesFilter;
    });

    const stats = {
        totalWorkers: workers.length,
        availableWorkers: workers.filter(w => w.availability).length,
        totalGroups: groups.length,
        availableGroups: groups.filter(g => g.availability).length
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Labor Management</h2>
                    <p className="text-sm text-gray-500">Manage individual workers and field groups</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold">Total Workers</p>
                    <h3 className="text-xl font-bold text-blue-600">{stats.totalWorkers}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-green-500 uppercase font-bold">Workers Avail.</p>
                    <h3 className="text-xl font-bold text-green-600">{stats.availableWorkers}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold">Total Groups</p>
                    <h3 className="text-xl font-bold text-purple-600">{stats.totalGroups}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-yellow-500 uppercase font-bold">Groups Avail.</p>
                    <h3 className="text-xl font-bold text-yellow-600">{stats.availableGroups}</h3>
                </div>
            </div>

            {/* TABS */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab("workers")}
                    className={`px-6 py-2 flex items-center gap-2 font-medium transition-colors ${activeTab === "workers" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"}`}
                >
                    <User size={18} /> Individual Workers
                </button>
                <button
                    onClick={() => setActiveTab("groups")}
                    className={`px-6 py-2 flex items-center gap-2 font-medium transition-colors ${activeTab === "groups" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500"}`}
                >
                    <Users size={18} /> Worker Groups
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Profile / Group</th>
                            <th className="px-6 py-4">Skills</th>
                            <th className="px-6 py-4">{activeTab === "workers" ? "Daily Wage" : "Group Wage"}</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={activeTab === "workers" ? item.userId?.profilePicture : item.groupImage || "https://via.placeholder.com/40"}
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    {activeTab === "workers" ? item.userId?.username : item.groupName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {activeTab === "workers" ? item.userId?.MobileNum : `Leader: ${item.leaderId?.username}`}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {item.skills?.slice(0, 2).map((skill, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                                                    {skill}
                                                </span>
                                            ))}
                                            {item.skills?.length > 2 && <span className="text-xs text-gray-400">+{item.skills.length - 2}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-200">
                                        ₹{activeTab === "workers" ? item.dailyWage : item.groupWagePerDay}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {item.availability ? "Available" : "Busy"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                                        {activeTab === "workers" ? getAddress(item.userId) : getAddress(item.leaderId)}
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
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                    No {activeTab} found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* DETAIL MODAL */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="relative h-32 bg-green-600">
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 text-white hover:bg-white/20 p-1 rounded-full transition-colors z-10"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="px-6 pb-6">
                            <img 
                                src={selectedItem.type === 'workers' ? selectedItem.data.userId?.profilePicture : selectedItem.data.groupImage || "https://via.placeholder.com/100"} 
                                className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 mx-auto -mt-14 object-cover shadow-md"
                                alt="Profile"
                            />
                            
                            <div className="text-center mt-4 mb-6">
                                <h3 className="text-2xl font-bold dark:text-white">
                                    {selectedItem.type === 'workers' ? selectedItem.data.userId?.username : selectedItem.data.groupName}
                                </h3>
                                <p className="text-green-600 font-semibold">{selectedItem.type === 'workers' ? 'Individual Labor' : 'Worker Group'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border dark:border-gray-700">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-1">
                                        <Briefcase size={14}/> Wage
                                    </div>
                                    <p className="font-bold text-lg dark:text-white">₹{selectedItem.type === 'workers' ? selectedItem.data.dailyWage : selectedItem.data.groupWagePerDay}<span className="text-xs font-normal text-gray-500">/day</span></p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border dark:border-gray-700">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-1">
                                        <Calendar size={14}/> Status
                                    </div>
                                    <p className={`font-bold text-lg ${selectedItem.data.availability ? 'text-green-500' : 'text-red-500'}`}>
                                        {selectedItem.data.availability ? 'Available' : 'Busy'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {selectedItem.type === 'workers' ? (
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl space-y-3">
                                        <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                                            <span className="text-gray-500 text-sm">Experience</span>
                                            <span className="font-semibold dark:text-gray-200">{selectedItem.data.experience || 'N/A'} Years</span>
                                        </div>
                                        <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                                            <span className="text-gray-500 text-sm">Machine Status</span>
                                            <span className="font-semibold dark:text-gray-200 capitalize">{selectedItem.data.machineStatus || 'None'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Phone</span>
                                            <span className="font-semibold dark:text-gray-200">{selectedItem.data.userId?.MobileNum}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl space-y-3">
                                        <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                                            <span className="text-gray-500 text-sm">Group Leader</span>
                                            <span className="font-semibold dark:text-gray-200">{selectedItem.data.leaderId?.username}</span>
                                        </div>
                                        <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                                            <span className="text-gray-500 text-sm">Leader Phone</span>
                                            <span className="font-semibold dark:text-gray-200">{selectedItem.data.leaderId?.MobileNum}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-sm block mb-2">Members ({selectedItem.data.members?.length || 0})</span>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedItem.data.members?.map((m, idx) => (
                                                    <span key={idx} className="text-xs bg-white dark:bg-gray-600 px-2 py-1 rounded border dark:border-gray-500 dark:text-gray-200">
                                                        {m.username}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Primary Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedItem.data.skills?.map((s, i) => (
                                            <span key={i} className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                                        <MapPin size={12}/> Address
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                        {selectedItem.type === 'workers' 
                                            ? getAddress(selectedItem.data.userId) 
                                            : getAddress(selectedItem.data.leaderId)}
                                    </p>
                                </div>
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

export default LaborList;