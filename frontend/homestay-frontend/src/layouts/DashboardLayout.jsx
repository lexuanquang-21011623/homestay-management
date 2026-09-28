import { NavLink, Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
    const navigate = useNavigate();
    const fullName = localStorage.getItem("fullName") || "Quản trị viên";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("fullName");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <div>
                    <h1 style={styles.logo}>Homestay</h1>

                    <div style={styles.welcome}>
                        <div style={styles.welcomeLabel}>Quản trị viên</div>
                        <div style={styles.fullName}>{fullName}</div>
                    </div>

                    <nav style={styles.menu}>
                        <NavLink to="/admin" end style={navStyle}>
                            Trang chủ
                        </NavLink>

                        <NavLink to="/admin/properties" style={navStyle}>
                            Cơ sở lưu trú
                        </NavLink>

                        <NavLink to="/admin/rooms" style={navStyle}>
                            Phòng
                        </NavLink>

                        <NavLink to="/admin/customers" style={navStyle}>
                            Khách hàng
                        </NavLink>

                        <NavLink to="/admin/bookings" style={navStyle}>
                            Đặt phòng
                        </NavLink>

                        <NavLink to="/admin/payments" style={navStyle}>
                            Thanh toán
                        </NavLink>

                        <NavLink to="/admin/amenities" style={navStyle}>
                            Tiện nghi
                        </NavLink>

                        <NavLink to="/admin/reviews" style={navStyle}>
                            Đánh giá
                        </NavLink>
                    </nav>
                </div>

                <button onClick={handleLogout} style={styles.logoutButton}>
                    Đăng xuất
                </button>
            </aside>

            <main style={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}

const navStyle = ({ isActive }) => ({
    display: "block",
    padding: "12px 14px",
    marginBottom: "6px",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    backgroundColor: isActive ? "#374151" : "transparent",
});

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#f3f4f6",
    },

    sidebar: {
        width: "240px",
        minHeight: "100vh",
        backgroundColor: "#1f2937",
        color: "white",
        padding: "24px 16px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },

    logo: {
        textAlign: "center",
        marginBottom: "24px",
    },

    welcome: {
        padding: "12px 14px",
        marginBottom: "16px",
        borderBottom: "1px solid #374151",
    },

    welcomeLabel: {
        color: "#9ca3af",
        fontSize: "13px",
        marginBottom: "4px",
    },

    fullName: {
        color: "#f9fafb",
        fontSize: "15px",
        fontWeight: "600",
    },

    menu: {
        display: "flex",
        flexDirection: "column",
    },

    logoutButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
    },

    main: {
        flex: 1,
        padding: "32px",
        boxSizing: "border-box",
        overflowX: "auto",
    },
};

export default DashboardLayout;