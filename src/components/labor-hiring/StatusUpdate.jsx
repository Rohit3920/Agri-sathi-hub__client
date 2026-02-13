import { useEffect, useState } from "react";
import api from "../../utils/api";

const StatusUpdate = ({ hireId }) => {
    const [hire, setHire] = useState(null);
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.userMode; // farmer / servicer

    // 🔹 Fetch Hire Details
    useEffect(() => {
        const fetchHire = async () => {
            try {
                const res = await api.get(`/api/labor/hire/${hireId}`);
                console.log(res.data)
                setHire(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHire();
    }, [hireId]);

    // 🔹 Update Status
    const handleStatusUpdate = async (newStatus) => {
        try {
            setLoading(true);

            const res = await api.put(`/api/labor/hire/${hireId}/status`, {
                status: newStatus,
                userRole
            });

            setHire(res.data.hire);
        } catch (err) {
            alert(err.response?.data?.message || "Error updating status");
        } finally {
            setLoading(false);
        }
    };

    if (!hire) return <p>Loading...</p>;

    // 🔹 Role Based Buttons
    const servicerActions = ["accepted", "rejected"];
    const farmerActions = ["rejected", "completed"];

    const actions =
        userRole === "servicer"
            ? servicerActions
            : userRole === "farmer"
            ? farmerActions
            : servicerActions;

    return (
        <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <p className="mb-3 text-gray-700 dark:text-gray-300">
                Current Status:
                <span className="ml-2 font-semibold capitalize text-blue-600">
                    {hire.status}
                </span>
            </p>

            <div className="flex gap-3">
                {actions.map((action) => (
                    <button
                        key={action}
                        disabled={loading || hire.status === action}
                        onClick={() => handleStatusUpdate(action)}
                        className={`px-4 py-2 rounded-lg text-white text-sm transition
                            ${
                                action === "accepted"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : action === "rejected"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }
                            disabled:opacity-50`}
                    >
                        {action}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StatusUpdate;