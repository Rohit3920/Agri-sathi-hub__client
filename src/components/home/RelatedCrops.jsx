import React from "react";

const RelatedCrops = ({ crops, selectCrop }) => {

    if (!crops.length) return null;

    return (

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Related Crops
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {crops.map(c => (
                    <div key={c._id}
                    onClick={() => selectCrop(c)}
                    className="border rounded-lg p-3 text-center dark:border-gray-700 hover:border-blue-500 cursor-pointer">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                            {c.cropName}
                        </p>
                    </div>
                ))}
            </div>

        </div>

    );

};

export default RelatedCrops;