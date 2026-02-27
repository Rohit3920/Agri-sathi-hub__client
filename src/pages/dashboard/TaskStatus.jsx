// components/worker/TaskStatus.jsx
import React from 'react';
import { Clock, PlayCircle } from 'lucide-react';

export const TaskStatus = ({ tasks }) => (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Current Work Status</h3>
        <div className="space-y-4">
            {tasks.map((task, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center gap-4">
                        <div className={task.status === 'active' ? 'text-green-500' : 'text-yellow-500'}>
                            {task.status === 'active' ? <PlayCircle /> : <Clock />}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-200">{task.title}</p>
                            <p className="text-xs text-gray-500 uppercase">{task.location}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${task.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {task.status}
                    </span>
                </div>
            ))}
        </div>
    </div>
);