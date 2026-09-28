import { NavLink, Outlet, useNavigate } from "react-router-dom";

function CustomerLayout() {
    const navigate = useNavigate();

    const fullName = localStorage.getItem("fullName") || "Khách hàng";

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
                        Xin chào, {fullName}
                    </div>

                    <nav style={styles.menu}>
                        <NavLink
                            to="/customer"
                            end
                            style={navStyle}
                        >
                            Trang chủ
                        </NavLink>

                        <NavLink
                            to="/customer/rooms"
                            style={navStyle}
                        >
                            Xem phòng
                        </NavLink>

                        <NavLink
                            to="/customer/cart"
                            style={navStyle}
                        >
                            Giỏ hàng
                        </NavLink>

                        <NavLink
                            to="/customer/bookings"
                            style={navStyle}
                        >
                            Đặt phòng của tôi
                        </NavLink>
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    style={styles.logoutButton}
                >
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
    backgroundColor: isActive
        ? "#374151"
        : "transparent",
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
        padding: "10px 14px",
        marginBottom: "16px",
        color: "#d1d5db",
        fontSize: "14px",
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
    },

    main: {
        flex: 1,
        padding: "32px",
        boxSizing: "border-box",
    },
};

export default CustomerLayout;
