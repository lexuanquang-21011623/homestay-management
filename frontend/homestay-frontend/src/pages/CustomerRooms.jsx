import { useEffect, useState } from "react";
import { api } from "../services/api";

function CustomerRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const userId = localStorage.getItem("userId");

    const loadRooms = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/rooms?page=0&size=100&sortBy=id&direction=asc"
            );

            setRooms(response.content || []);
        } catch (error) {
            setError(error.message || "Không thể tải danh sách phòng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);

    const addToCart = async (roomId) => {
        try {
            setError("");
            setSuccess("");

            if (!userId) {
                setError("Bạn chưa đăng nhập.");
                return;
            }

            await api.post(`/cart/${userId}/items`, {
                roomId: roomId,
                quantity: 1,
            });

            setSuccess("Đã thêm phòng vào giỏ hàng.");
        } catch (error) {
            setError(error.message || "Không thể thêm phòng vào giỏ hàng.");
        }
    };

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("vi-VN");
    };

    if (loading) {
        return (
            <div>
                <h1>Xem phòng</h1>
                <p>Đang tải danh sách phòng...</p>
            </div>
        );
    }

    return (
        <div>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Xem phòng</h1>
                    <p style={styles.subtitle}>
                        Chọn phòng phù hợp và thêm vào giỏ hàng.
                    </p>
                </div>
            </div>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {success && (
                <div style={styles.success}>
                    {success}
                </div>
            )}

            {rooms.length === 0 ? (
                <div style={styles.empty}>
                    Hiện tại chưa có phòng nào.
                </div>
            ) : (
                <div style={styles.grid}>
                    {rooms.map((room) => (
                        <div key={room.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h2 style={styles.roomName}>
                                    {room.name}
                                </h2>

                                <span style={styles.roomNumber}>
                                    Phòng {room.roomNumber}
                                </span>
                            </div>

                            <div style={styles.info}>
                                <p>
                                    <strong>Sức chứa:</strong>{" "}
                                    {room.capacity} người
                                </p>

                                <p>
                                    <strong>Giá:</strong>{" "}
                                    {formatPrice(room.price)} VNĐ / đêm
                                </p>

                                <p>
                                    <strong>Còn lại:</strong>{" "}
                                    {room.availableQuantity} phòng
                                </p>

                                {room.description && (
                                    <p>
                                        <strong>Mô tả:</strong>{" "}
                                        {room.description}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => addToCart(room.id)}
                                disabled={
                                    !room.availableQuantity ||
                                    room.availableQuantity <= 0
                                }
                                style={{
                                    ...styles.button,
                                    backgroundColor:
                                        room.availableQuantity > 0
                                            ? "#2563eb"
                                            : "#9ca3af",
                                    cursor:
                                        room.availableQuantity > 0
                                            ? "pointer"
                                            : "not-allowed",
                                }}
                            >
                                {room.availableQuantity > 0
                                    ? "Thêm vào giỏ hàng"
                                    : "Hết phòng"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    header: {
        marginBottom: "24px",
    },

    title: {
        margin: 0,
        marginBottom: "8px",
    },

    subtitle: {
        margin: 0,
        color: "#6b7280",
    },

    error: {
        padding: "12px 16px",
        marginBottom: "20px",
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "8px",
    },

    success: {
        padding: "12px 16px",
        marginBottom: "20px",
        backgroundColor: "#dcfce7",
        color: "#166534",
        borderRadius: "8px",
    },

    empty: {
        padding: "40px",
        backgroundColor: "white",
        borderRadius: "12px",
        textAlign: "center",
        color: "#6b7280",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
    },

    card: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    },

    cardHeader: {
        marginBottom: "16px",
    },

    roomName: {
        margin: "0 0 6px 0",
        fontSize: "20px",
    },

    roomNumber: {
        color: "#6b7280",
        fontSize: "14px",
    },

    info: {
        lineHeight: "1.6",
        marginBottom: "20px",
    },

    button: {
        width: "100%",
        padding: "11px",
        border: "none",
        borderRadius: "6px",
        color: "white",
        fontSize: "15px",
    },
};

export default CustomerRooms;