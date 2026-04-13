// components/admin/layout/AdminLayout.jsx
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">

            {/* Sidebar (Fixed, No Scroll) */}
            <div className="w-64 h-full">
                <Sidebar />
            </div>

            {/* Right Section */}
            <div className="flex flex-col flex-1 h-full">

                {/* Navbar (Fixed) */}
                <div className="shrink-0">
                    <Navbar />
                </div>

                {/* Scrollable Content ONLY */}
                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default AdminLayout;