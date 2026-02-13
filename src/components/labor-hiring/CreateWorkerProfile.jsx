import React, { useState } from 'react';
import api from '../../utils/api';

const CreateWorkerProfile = ({ userId }) => {
    const [formData, setFormData] = useState({
        userId: userId || '', 
        skills: [''], // Initialized as an array with one empty string
        experience: 0,
        dailyWage: '',
        availability: true
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // --- Dynamic Skills Logic ---
    const handleSkillChange = (index, value) => {
        const updatedSkills = [...formData.skills];
        updatedSkills[index] = value;
        setFormData({ ...formData, skills: updatedSkills });
    };

    const addSkillField = () => {
        setFormData({ ...formData, skills: [...formData.skills, ''] });
    };

    const removeSkillField = (index) => {
        const updatedSkills = formData.skills.filter((_, i) => i !== index);
        setFormData({ ...formData, skills: updatedSkills });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Clean the payload: remove any empty skill rows before sending
            const payload = {
                ...formData,
                skills: formData.skills.filter(skill => skill.trim() !== "")
            };

            const response = await api.post('/api/labor/worker/profile', payload);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            console.log("Response:", response.data);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Something went wrong'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Worker Profile</h2>

            {message.text && (
                <div className={`mb-4 p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Dynamic Skills Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">My Skills</label>
                    {formData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                placeholder="e.g. Plumbing"
                                className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                required={index === 0} // Ensure at least one skill is filled
                            />
                            {formData.skills.length > 1 && (
                                <button 
                                    type="button" 
                                    onClick={() => removeSkillField(index)}
                                    className="text-red-500 hover:text-red-700 text-lg font-bold px-1"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSkillField}
                        className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider"
                    >
                        + Add Skill
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Experience Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                        <input
                            type="number"
                            name="experience"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                            value={formData.experience}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Daily Wage Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Daily Wage ($)</label>
                        <input
                            type="number"
                            name="dailyWage"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                            value={formData.dailyWage}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center pt-2">
                    <input
                        type="checkbox"
                        name="availability"
                        id="availability"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={formData.availability}
                        onChange={handleChange}
                    />
                    <label htmlFor="availability" className="ml-2 block text-sm text-gray-700 font-medium">
                        Available for work
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
                >
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default CreateWorkerProfile;