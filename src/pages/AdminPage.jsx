import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../components/admin/layout/AdminLayout";

// Dashboard
import Dashboard from "../components/admin/dashboard/Dashboard";

// Panels
import UserList from "../components/admin/users/UserList";
import MachineList from "../components/admin/machines/MachineList";
import LaborList from "../components/admin/labor/LaborList";

// (Optional panels - create later)
import BookingList from "../components/admin/booking/BookingList";
import SchemeList from "../components/admin/schemes/SchemeList";
import WeatherDetails from "../components/admin/weather/WeatherDetails";
import AdminLogin from "../components/admin/AdminLogin";
// import PaymentList from "../components/admin/payments/PaymentList";
// import WeatherPanel from "../components/admin/weather/WeatherPanel";

const AdminPage = () => {
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";

    if (!isAdmin) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <AdminLayout>
            <Routes>

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="dashboard" />} />
                {/* Dashboard */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* Core Panels */}
                <Route path="users" element={<UserList />} />
                <Route path="machines" element={<MachineList />} />
                <Route path="labor" element={<LaborList />} />

                {/* Extended Panels */}
                <Route path="bookings" element={<BookingList />} />
                <Route path="schemes" element={<SchemeList />} />
                {/* <Route path="payments" element={<PaymentList />} /> */}
                <Route path="/weather" element={<WeatherDetails />} />

                {/* Fallback */}
                <Route path="*" element={<div>Page Not Found</div>} />

            </Routes>
        </AdminLayout>
    );
};

export default AdminPage;