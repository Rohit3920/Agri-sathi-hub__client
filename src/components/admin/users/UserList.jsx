import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Search } from "lucide-react";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filterMode, setFilterMode] = useState("all");
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        api.get("/api/auth/get-all-users")
            .then(res => setUsers(res.data))
            .catch(() => console.error("Failed to fetch users"));
    }, []);

    // ✅ COUNTS
    const farmerCount = users.filter(u => u.userMode === "farmer").length;
    const servicerCount = users.filter(u => u.userMode === "servicer").length;
    const workerCount = users.filter(u => u.userMode === "worker").length;
    const totalCount = users.length; // ✅ NEW TOTAL

    // FILTER + SEARCH
    const filteredUsers = users.filter((u) => {
        const address = u.address?.[0] || {};

        const fullText = `
            ${u.userMode}
            ${u.username}
            ${u.email}
            ${u.MobileNum}
            ${address.street}
            ${address.city}
            ${address.subDistrict}
            ${address.district}
            ${address.state}
            ${address.zipCode}
        `.toLowerCase();

        const matchSearch = fullText.includes(search.toLowerCase());
        const matchFilter =
            filterMode === "all" || u.userMode === filterMode;

        return matchSearch && matchFilter;
    });

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/auth/delete-user/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch {
            alert("Delete failed");
        }
    };

    return (
        <div className="p-6">

            {/* ✅ UPDATED COUNTS STYLE */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-5 rounded-2xl shadow-lg">
                    <p className="text-sm opacity-80">Total Users</p>
                    <h2 className="text-2xl font-bold">{totalCount}</h2>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-5 rounded-2xl shadow-lg">
                    <p className="text-sm opacity-80">Farmers</p>
                    <h2 className="text-2xl font-bold">{farmerCount}</h2>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-5 rounded-2xl shadow-lg">
                    <p className="text-sm opacity-80">Servicers</p>
                    <h2 className="text-2xl font-bold">{servicerCount}</h2>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-5 rounded-2xl shadow-lg">
                    <p className="text-sm opacity-80">Workers</p>
                    <h2 className="text-2xl font-bold">{workerCount}</h2>
                </div>

            </div>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
                    User Management
                </h2>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>

                    <select
                        value={filterMode}
                        onChange={(e) => setFilterMode(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                        <option value="all">All Users</option>
                        <option value="farmer">Farmer</option>
                        <option value="servicer">Servicer</option>
                        <option value="worker">Worker</option>
                    </select>
                </div>
            </div>

            {/* TABLE (UNCHANGED) */}
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left">

                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">User Type</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Mobile</th>
                            <th className="px-4 py-3">Address</th>
                            <th className="px-4 py-3">Options</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => {
                                const addr = u.address?.[0] || {};

                                return (
                                    <tr
                                        key={u._id}
                                        className="border-t hover:bg-green-50 dark:hover:bg-gray-800 transition cursor-pointer"
                                        onClick={() => setSelectedUser(u)}
                                    >
                                        <td className="px-4 py-3 capitalize font-semibold text-green-600">
                                            {u.userMode}
                                        </td>

                                        <td className="px-4 py-3 dark:text-white">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={u.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                                    className="w-8 h-8 rounded-full object-cover border"
                                                />
                                                {u.username}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 dark:text-gray-300">{u.email}</td>
                                        <td className="px-4 py-3 dark:text-gray-300">{u.MobileNum}</td>

                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                            {addr.street}, {addr.city} <br />
                                            {addr.subDistrict}, {addr.state} - {addr.zipCode}
                                        </td>

                                        <td
                                            className="px-4 py-3 flex gap-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => setSelectedUser(u)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                                            >
                                                Show
                                            </button>

                                            <button
                                                onClick={() => handleDelete(u._id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL (UNCHANGED) */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg relative">

                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-2 right-3 text-red-500 text-xl"
                        >
                            ✖
                        </button>

                        <div className="text-center">
                            <img
                                src={selectedUser.profilePicture}
                                className="w-20 h-20 rounded-full mx-auto mb-3"
                            />
                            <h3 className="text-xl font-bold dark:text-white">{selectedUser.username}</h3>
                            <p className="text-sm text-gray-500">{selectedUser.userMode}</p>
                        </div>

                        <div className="mt-4 space-y-2 text-sm dark:text-gray-300">
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Mobile:</strong> {selectedUser.MobileNum}</p>
                            <p><strong>City:</strong> {selectedUser.address?.[0]?.city}</p>
                            <p><strong>State:</strong> {selectedUser.address?.[0]?.state}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserList;