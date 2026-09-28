import { useEffect, useState } from "react";
import { api } from "../services/api";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await api.get("/dashboard");
                setDashboard(data);
            } catch (error) {
                setError(error.message);
            }
        };

        loadDashboard();
    }, []);

    if (error) {
        return (
            <div>
                <h1>Trang chủ</h1>
                <p style={{ color: "red" }}>
                    {error}
                </p>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div>
                <h1>Trang chủ</h1>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    const cards = [
        {
            title: "Tổng Homestay",
            value: dashboard.totalProperties,
        },
        {
            title: "Tổng phòng",
            value: dashboard.totalRooms,
        },
        {
            title: "Tổng khách hàng",
            value: dashboard.totalCustomers,
        },
        {
            title: "Tổng booking",
            value: dashboard.totalBookings,
        },
        {
            title: "Tổng thanh toán",
            value: dashboard.totalPayments,
        },
        {
            title: "Tổng doanh thu",
            value: `${dashboard.totalRevenue.toLocaleString("vi-VN")} VNĐ`,
        },
    ];

    return (
        <div>
            <h1>Trang chủ</h1>

            <p style={styles.subtitle}>
                Tổng quan hệ thống quản lý Homestay
            </p>

            <div style={styles.grid}>
                {cards.map((card) => (
                    <div
                        key={card.title}
                        style={styles.card}
                    >
                        <p style={styles.title}>
                            {card.title}
                        </p>

                        <h2 style={styles.value}>
                            {card.value}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    subtitle: {
        color: "#6b7280",
        marginBottom: "24px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(200px, 1fr))",
        gap: "20px",
    },

    card: {
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow:
            "0 2px 10px rgba(0, 0, 0, 0.08)",
    },

    title: {
        color: "#6b7280",
        margin: "0 0 10px 0",
    },

    value: {
        margin: 0,
        fontSize: "28px",
    },
};

export default Dashboard;