import React from "react";

const Pesticides = ({ pesticides }) => {

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Suggested Pesticides
            </h3>

            <ul className="space-y-2">

                {pesticides.map((p) => (
                    <li key={p._id} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        ✔ {p.name}
                    </li>
                ))}

            </ul>

        </div>

    );

};

export default Pesticides;