import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Property from "./pages/Property";
import Room from "./pages/Room";
import Customer from "./pages/Customer";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Amenity from "./pages/Amenity";
import Review from "./pages/Review";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CustomerRooms from "./pages/CustomerRooms";
import CustomerBookings from "./pages/CustomerBookings";

import DashboardLayout from "./layouts/DashboardLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* ==================== ADMIN ==================== */}
                <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/admin" element={<Dashboard />} />

                        <Route
                            path="/admin/properties"
                            element={<Property />}
                        />

                        <Route
                            path="/admin/rooms"
                            element={<Room />}
                        />

                        <Route
                            path="/admin/customers"
                            element={<Customer />}
                        />

                        <Route
                            path="/admin/bookings"
                            element={<Booking />}
                        />

                        <Route
                            path="/admin/payments"
                            element={<Payment />}
                        />

                        <Route
                            path="/admin/amenities"
                            element={<Amenity />}
                        />

                        <Route
                            path="/admin/reviews"
                            element={<Review />}
                        />
                    </Route>
                </Route>

                {/* ==================== CUSTOMER ==================== */}
                <Route element={<ProtectedRoute allowedRole="CUSTOMER" />}>
                    <Route element={<CustomerLayout />}>
                        <Route
                            path="/customer"
                            element={<CustomerHome />}
                        />

                        <Route
                            path="/customer/rooms"
                            element={<CustomerRooms />}
                        />

                        <Route
                            path="/customer/cart"
                            element={<Cart />}
                        />

                        <Route
                            path="/customer/checkout"
                            element={<Checkout />}
                        />

                        <Route
                            path="/customer/bookings"
                            element={<CustomerBookings />}
                        />
                    </Route>
                </Route>

                {/* ==================== ĐIỀU HƯỚNG ==================== */}
                <Route path="/" element={<RoleRedirect />} />

                <Route path="*" element={<RoleRedirect />} />
            </Routes>
        </BrowserRouter>
    );
}

function CustomerHome() {
    return (
        <div>
            <h1>Chào mừng đến với Homestay</h1>

            <p>
                Tìm kiếm và đặt phòng phù hợp với bạn.
            </p>

            <div
                style={{
                    marginTop: "30px",
                    padding: "24px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                }}
            >
                <h2>Đặt phòng ngay</h2>

                <p>
                    Xem danh sách phòng và chọn phòng bạn muốn đặt.
                </p>
            </div>
        </div>
    );
}

function RoleRedirect() {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role === "ADMIN") {
        return <Navigate to="/admin" replace />;
    }

    if (role === "CUSTOMER") {
        return <Navigate to="/customer" replace />;
    }

    return <Navigate to="/login" replace />;
}

export default App;