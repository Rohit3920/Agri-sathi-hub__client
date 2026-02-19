export default function AddressFields({ formData, handleChange, t }) {
    return (
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t("Address Details")}</p>
            <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" name="street" placeholder={t("Street")} value={formData.address.street} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="text" name="city" placeholder={t("City")} value={formData.address.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input type="text" name="district" placeholder={t("District")} value={formData.address.district} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="text" name="zipCode" placeholder={t("Zip")} value={formData.address.zipCode} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
        </div>
    );
}