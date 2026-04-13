import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Settings2,
    UserCog,
    CalendarCheck,
    FileText,
    CloudSun
} from "lucide-react"; // Optional: npm install lucide-react

const Sidebar = () => {
    // Common styles for all links
    const baseStyle = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group";

    // Dynamic style function for active/inactive states
    const navLinkStyle = ({ isActive }) =>
        isActive
            ? `${baseStyle} bg-green-600 text-white shadow-md shadow-green-200 dark:shadow-none`
            : `${baseStyle} text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600`;

    const menuItems = [
        { path: "/admin", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { path: "/admin/users", name: "Users", icon: <Users size={20} /> },
        { path: "/admin/machines", name: "Machines", icon: <Settings2 size={20} /> },
        { path: "/admin/labor", name: "Labor", icon: <UserCog size={20} /> },
        { path: "/admin/bookings", name: "Bookings", icon: <CalendarCheck size={20} /> },
        { path: "/admin/schemes", name: "Schemes", icon: <FileText size={20} /> },
        { path: "/admin/weather", name: "Weather", icon: <CloudSun size={20} /> },
    ];

    return (
        <div className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 sticky top-0"
            style={{
                height: `calc(100vh - 70px)`
            }}>
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="bg-green-600 p-1.5 rounded-lg text-white">
                    {/* Simple Leaf Icon Placeholder */}
                    <span className="font-bold">A</span>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-gray-800 dark:text-white">
                    Agri<span className="text-green-600">Admin</span>
                </h2>
            </div>

            <nav className="flex flex-col gap-1.5">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin"} // Prevents dashboard being active on all sub-routes
                        className={navLinkStyle}
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer-style Sidebar item */}
            <div className="absolute bottom-4 left-0 w-full px-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Logged in as</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Admin Panel v2.0</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;