import { useEffect, useState } from "react";
import { api } from "../services/api";

function CustomerBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const customerResponse = await api.get(
                `/customers/user/${userId}`
            );

            const customerId = customerResponse.id;

            const response = await api.get(
                `/bookings/customer/${customerId}?page=0&size=100`
            );

            setBookings(response.content || []);
        } catch (error) {
            setError(
                error.message || "Không thể tải danh sách đặt phòng."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadBookings();
        } else {
            setError("Bạn chưa đăng nhập.");
            setLoading(false);
        }
    }, []);

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("vi-VN");
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("vi-VN");
    };

    const getStatusText = (status) => {
        switch (status) {
            case "CONFIRMED":
                return "Đã xác nhận";
            case "PENDING":
                return "Chờ xử lý";
            case "CANCELLED":
                return "Đã hủy";
            case "COMPLETED":
                return "Hoàn thành";
            default:
                return status || "-";
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Đặt phòng của tôi</h1>
                <p>Đang tải danh sách đặt phòng...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={styles.title}>Đặt phòng của tôi</h1>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {!error && bookings.length === 0 && (
                <div style={styles.empty}>
                    <h2>Bạn chưa có đơn đặt phòng nào.</h2>
                    <p>
                        Khi bạn đặt phòng thành công, đơn đặt phòng sẽ xuất hiện
                        ở đây.
                    </p>
                </div>
            )}

            {bookings.length > 0 && (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>Mã đặt phòng</th>
                            <th style={styles.th}>Phòng</th>
                            <th style={styles.th}>Ngày nhận</th>
                            <th style={styles.th}>Ngày trả</th>
                            <th style={styles.th}>Số lượng</th>
                            <th style={styles.th}>Tổng tiền</th>
                            <th style={styles.th}>Trạng thái</th>
                        </tr>
                        </thead>

                        <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td style={styles.td}>
                                    #{booking.id}
                                </td>

                                <td style={styles.td}>
                                    {booking.room?.name ||
                                        `Phòng #${booking.room?.id || "-"}`}
                                </td>

                                <td style={styles.td}>
                                    {formatDate(
                                        booking.checkInDate
                                    )}
                                </td>

                                <td style={styles.td}>
                                    {formatDate(
                                        booking.checkOutDate
                                    )}
                                </td>

                                <td style={styles.td}>
                                    {booking.roomQuantity || 1}
                                </td>

                                <td style={styles.td}>
                                    {formatPrice(
                                        booking.totalPrice
                                    )}{" "}
                                    VNĐ
                                </td>

                                <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.status,
                                                backgroundColor:
                                                    booking.status ===
                                                    "CONFIRMED"
                                                        ? "#dcfce7"
                                                        : booking.status ===
                                                        "CANCELLED"
                                                            ? "#fee2e2"
                                                            : "#fef3c7",
                                                color:
                                                    booking.status ===
                                                    "CONFIRMED"
                                                        ? "#166534"
                                                        : booking.status ===
                                                        "CANCELLED"
                                                            ? "#b91c1c"
                                                            : "#92400e",
                                            }}
                                        >
                                            {getStatusText(
                                                booking.status
                                            )}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const styles = {
    title: {
        marginBottom: "24px",
    },

    error: {
        padding: "12px 16px",
        marginBottom: "20px",
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "8px",
    },

    empty: {
        padding: "40px",
        backgroundColor: "white",
        borderRadius: "12px",
        textAlign: "center",
        color: "#6b7280",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    },

    tableContainer: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        overflowX: "auto",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "900px",
    },

    th: {
        textAlign: "left",
        padding: "14px 12px",
        borderBottom: "2px solid #e5e7eb",
        backgroundColor: "#f9fafb",
        whiteSpace: "nowrap",
    },

    td: {
        padding: "14px 12px",
        borderBottom: "1px solid #e5e7eb",
    },

    status: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: "600",
        whiteSpace: "nowrap",
    },
};

export default CustomerBookings;