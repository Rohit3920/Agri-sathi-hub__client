import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Save, X, FileText, Users, IndianRupee, 
    Calendar, Globe, ShieldCheck, ClipboardList 
} from 'lucide-react';
import api from "../../../utils/api";

function SchemeForm({ onClose, onRefresh }) {
    const [formData, setFormData] = useState({
        scheme_id: '',
        scheme_name: '',
        scheme_type: '',
        target_beneficiaries: '',
        benefit_type: '',
        benefit_amount: '',
        state: [],
        beneficiaries_count: '',
        fund_disbursed_core: '',
        scheme_status: 'Active',
        launch_year: new Date().getFullYear(),
        eligibility_criteria: '',
        scheme_website_link: '',
        document_required_column: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/api/gov-scheme", formData);
            alert("Scheme added successfully!");
            if (onRefresh) onRefresh();
            if (onClose) onClose();
        } catch (error) {
            console.error("Error adding scheme:", error);
            alert(error.response?.data?.message || "Failed to add scheme");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
            {/* Form Header */}
            <div className="p-8 bg-gray-50/50 dark:bg-gray-800/50 border-b dark:border-gray-800 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Add New Scheme</h2>
                    <p className="text-sm text-gray-500 font-medium italic">Enter government initiative details</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-xl transition-colors">
                        <X size={24} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <FormInput label="Scheme ID (Unique)" name="scheme_id" value={formData.scheme_id} onChange={handleChange} icon={<ShieldCheck size={18}/>} placeholder="e.g. PM-KISAN-01" required />
                        <FormInput label="Scheme Name" name="scheme_name" value={formData.scheme_name} onChange={handleChange} icon={<FileText size={18}/>} placeholder="e.g. Pradhan Mantri Kisan Samman Nidhi" required />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Scheme Type" name="scheme_type" value={formData.scheme_type} onChange={handleChange} placeholder="Central/State" />
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Status</label>
                                <select 
                                    name="scheme_status" 
                                    value={formData.scheme_status} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500 font-bold text-sm"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Financial & Target Section */}
                    <div className="space-y-4">
                        <FormInput label="Target Beneficiaries" name="target_beneficiaries" value={formData.target_beneficiaries} onChange={handleChange} icon={<Users size={18}/>} placeholder="e.g. Small & Marginal Farmers" />
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Benefit Type" name="benefit_type" value={formData.benefit_type} onChange={handleChange} placeholder="Direct/Subsidy" />
                            <FormInput label="Benefit Amount" name="benefit_amount" value={formData.benefit_amount} onChange={handleChange} icon={<IndianRupee size={18}/>} placeholder="e.g. 6000" />
                        </div>
                        <FormInput label="Website Link" name="scheme_website_link" value={formData.scheme_website_link} onChange={handleChange} icon={<Globe size={18}/>} placeholder="https://..." />
                    </div>

                    {/* Additional Stats Section */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Launch Year" type="number" name="launch_year" value={formData.launch_year} onChange={handleChange} icon={<Calendar size={18}/>} />
                            <FormInput label="Beneficiaries Count" name="beneficiaries_count" value={formData.beneficiaries_count} onChange={handleChange} placeholder="e.g. 10 Crores" />
                        </div>
                        <FormInput label="Total Fund Disbursed" name="fund_disbursed_core" value={formData.fund_disbursed_core} onChange={handleChange} placeholder="e.g. 2.5 Lakh Crore" />
                    </div>

                    {/* Large Text Areas */}
                    <div className="space-y-4">
                        <FormTextArea label="Eligibility Criteria" name="eligibility_criteria" value={formData.eligibility_criteria} onChange={handleChange} placeholder="Who can apply?..." icon={<ClipboardList size={18}/>} />
                    </div>

                    <div className="md:col-span-2">
                        <FormTextArea label="Required Documents" name="document_required_column" value={formData.document_required_column} onChange={handleChange} placeholder="Aadhar card, Bank details, Land records..." />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-6">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black shadow-xl shadow-green-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : <><Save size={20}/> Save Scheme</>}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Reusable Sub-components
const FormInput = ({ label, icon, ...props }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
            <input 
                {...props}
                className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500 font-bold text-sm transition-all`}
            />
        </div>
    </div>
);

const FormTextArea = ({ label, icon, ...props }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-4 top-4 text-gray-400">{icon}</div>}
            <textarea 
                {...props}
                rows="3"
                className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500 font-bold text-sm transition-all resize-none`}
            />
        </div>
    </div>
);

export default SchemeForm;