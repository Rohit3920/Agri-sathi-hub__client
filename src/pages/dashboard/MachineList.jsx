import React, { useState } from 'react';
import { Plus, MoreVertical, X } from 'lucide-react';
import AddMachine from '../../components/machine-rentals/AddMachine';

const MachineList = ({ machines }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">
                        My Machines
                    </h3>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        <Plus size={20} /> Add Machine
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                                <th className="pb-4">Machine Name</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {machines.map((machine, i) => (
                                <tr key={i} className="group">
                                    <td className="py-4 font-bold text-gray-800 dark:text-gray-200">
                                        {machine.machineName}
                                    </td>
                                    <td className="py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                machine.machineStatus === 'active'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-yellow-100 text-yellow-600'
                                            }`}
                                        >
                                            {machine.machineStatus}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-400">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Floating Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl p-6 animate-scaleIn">

                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                        >
                            <X size={22} />
                        </button>

                        <AddMachine closeModal={() => setShowModal(false)} />
                    </div>
                </div>
            )}
        </>
    );
};

export default MachineList;