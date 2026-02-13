import React, { useState } from 'react';
import api from '../../utils/api';
import { Camera } from "lucide-react";
import UploadHireWorkerGroupImage from "../uploadImages/UploadHireWorkerGroupImage";

const CreateWorkerGroup = ({ leaderId }) => {
    const [showUpload, setShowUpload] = useState(false);
    const [formData, setFormData] = useState({
        groupImage: '', // Stores the URL returned from the server
        groupName: '',
        leaderId: leaderId || '',
        members: [''],
        skills: [''],
        groupWagePerDay: '',
        availability: true
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Function to catch the uploaded image URL
    const handleImageUploadSuccess = (url) => {
        setFormData(prev => ({ ...prev, groupImage: url }));
        setShowUpload(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleArrayChange = (index, value, field) => {
        const updatedArray = [...formData[field]];
        updatedArray[index] = value;
        setFormData({ ...formData, [field]: updatedArray });
    };

    const addField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeField = (index, field) => {
        const updatedArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: updatedArray });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = {
                ...formData,
                skills: formData.skills.filter(s => s.trim() !== ""),
                members: formData.members.filter(id => id.trim() !== "")
            };

            await api.post('/api/labor/worker-group', payload);
            setMessage({ type: 'success', text: 'Group created successfully!' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to create group'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        {/* Visual feedback if image is uploaded */}
                        {formData.groupImage ? (
                            <img
                                src={formData.groupImage}
                                alt="Profile"
                                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">
                                <Camera size={20} />
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">Register Worker Group</h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowUpload(true)}
                        className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-full transition"
                    >
                        <Camera size={18} className="text-indigo-600" />
                    </button>
                </div>

                {message.text && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Group Name</label>
                        <input
                            type="text"
                            name="groupName"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.groupName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <label className="block text-sm font-semibold text-blue-800 mb-2">Group Skills</label>
                        {formData.skills.map((skill, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={skill}
                                    onChange={(e) => handleArrayChange(index, e.target.value, 'skills')}
                                    placeholder="e.g. Masonry"
                                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-400 outline-none"
                                />
                                {formData.skills.length > 1 && (
                                    <button type="button" onClick={() => removeField(index, 'skills')} className="text-red-400 hover:text-red-600 px-2">✕</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={() => addField('skills')} className="mt-1 text-xs text-blue-600 font-bold hover:underline">+ Add Skill</button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Team Member IDs</label>
                        {formData.members.map((member, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={member}
                                    onChange={(e) => handleArrayChange(index, e.target.value, 'members')}
                                    placeholder="Paste User ID"
                                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-400 outline-none"
                                />
                                {formData.members.length > 1 && (
                                    <button type="button" onClick={() => removeField(index, 'members')} className="text-red-400 hover:text-red-600 px-2">✕</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={() => addField('members')} className="mt-1 text-xs text-indigo-600 font-bold hover:underline">+ Add Member ID</button>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Group Wage Per Day</label>
                        <input
                            type="number"
                            name="groupWagePerDay"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.groupWagePerDay}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:bg-indigo-300"
                    >
                        {loading ? 'Creating Group...' : 'Register Group'}
                    </button>
                </form>
            </div>

            {showUpload && (
                <UploadHireWorkerGroupImage
                    onClose={() => setShowUpload(false)}
                    onUploadSuccess={handleImageUploadSuccess}
                />
            )}
        </>
    );
};

export default CreateWorkerGroup;