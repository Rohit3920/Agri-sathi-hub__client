import React from "react";

const Fertilizers = ({ fertilizers }) => {

    return (

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">

            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Recommended Fertilizers
            </h3>

            <ul className="space-y-2">

                {fertilizers.map((f) => (
                    <li key={f._id} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        ✔ {f.name}
                    </li>
                ))}

            </ul>

        </div>

    );

};

export default Fertilizers;