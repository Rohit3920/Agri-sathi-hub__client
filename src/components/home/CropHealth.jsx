import React from "react";

const CropHealth = ({ health }) => {
    if (!health) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Crop Health Status
            </h3>

            <div className={`text-2xl font-bold ${health.status === "Healthy"
                    ? "text-green-600"
                    : "text-red-500"
                }`}>
                {health.status}

                {health.issues.length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Issues: {health.issues.join(", ")}
                    </div>
                )}
            </div>

        </div>

    );

};

export default CropHealth;