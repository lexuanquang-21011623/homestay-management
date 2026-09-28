import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId");

    const loadCart = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/cart/${userId}`);
            setCart(response);
        } catch (error) {
            setError(error.message || "Không thể tải giỏ hàng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadCart();
        } else {
            setError("Bạn chưa đăng nhập.");
            setLoading(false);
        }
    }, []);

    const updateQuantity = async (cartItemId, quantity) => {
        try {
            setError("");
            setSuccess("");

            if (quantity < 1) {
                return;
            }

            const response = await api.put(
                `/cart/${userId}/items/${cartItemId}`,
                {
                    quantity: quantity,
                }
            );

            setCart(response);
            setSuccess("Đã cập nhật số lượng.");
        } catch (error) {
            setError(
                error.message || "Không thể cập nhật số lượng."
            );
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            setError("");
            setSuccess("");

            const response = await api.delete(
                `/cart/${userId}/items/${cartItemId}`
            );

            setCart(response);
            setSuccess("Đã xóa phòng khỏi giỏ hàng.");
        } catch (error) {
            setError(
                error.message || "Không thể xóa phòng khỏi giỏ hàng."
            );
        }
    };

    const clearCart = async () => {
        try {
            setError("");
            setSuccess("");

            const response = await api.delete(`/cart/${userId}`);

            setCart(response);
            setSuccess("Đã xóa toàn bộ giỏ hàng.");
        } catch (error) {
            setError(
                error.message || "Không thể xóa giỏ hàng."
            );
        }
    };

    const calculateTotal = () => {
        if (!cart?.items) {
            return 0;
        }

        return cart.items.reduce((total, item) => {
            const price = Number(item.room?.price || 0);
            const quantity = Number(item.quantity || 0);

            return total + price * quantity;
        }, 0);
    };

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("vi-VN");
    };

    if (loading) {
        return (
            <div>
                <h1>Giỏ hàng</h1>
                <p>Đang tải giỏ hàng...</p>
            </div>
        );
    }

    if (!userId) {
        return (
            <div>
                <h1>Giỏ hàng</h1>
                <p>Bạn cần đăng nhập để sử dụng giỏ hàng.</p>
            </div>
        );
    }

    const items = cart?.items || [];
    const total = calculateTotal();

    return (
        <div>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Giỏ hàng</h1>
                    <p style={styles.subtitle}>
                        Kiểm tra phòng trước khi đặt.
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

            {items.length === 0 ? (
                <div style={styles.empty}>
                    <h2>Giỏ hàng đang trống</h2>

                    <p>
                        Hãy chọn phòng bạn muốn đặt.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/customer/rooms")
                        }
                        style={styles.primaryButton}
                    >
                        Xem phòng
                    </button>
                </div>
            ) : (
                <>
                    <div style={styles.list}>
                        {items.map((item) => (
                            <div
                                key={item.id}
                                style={styles.item}
                            >
                                <div style={styles.itemInfo}>
                                    <h2 style={styles.roomName}>
                                        {item.room?.name ||
                                            "Phòng"}
                                    </h2>

                                    <p>
                                        Phòng số:{" "}
                                        {item.room?.roomNumber ||
                                            "-"}
                                    </p>

                                    <p>
                                        Giá:{" "}
                                        <strong>
                                            {formatPrice(
                                                item.room?.price
                                            )}{" "}
                                            VNĐ / đêm
                                        </strong>
                                    </p>

                                    <p>
                                        Thành tiền:{" "}
                                        <strong>
                                            {formatPrice(
                                                Number(
                                                    item.room
                                                        ?.price ||
                                                    0
                                                ) *
                                                Number(
                                                    item.quantity ||
                                                    0
                                                )
                                            )}{" "}
                                            VNĐ
                                        </strong>
                                    </p>
                                </div>

                                <div style={styles.actions}>
                                    <div
                                        style={
                                            styles.quantityGroup
                                        }
                                    >
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity -
                                                    1
                                                )
                                            }
                                            disabled={
                                                item.quantity <=
                                                1
                                            }
                                            style={
                                                styles.quantityButton
                                            }
                                        >
                                            -
                                        </button>

                                        <span
                                            style={
                                                styles.quantity
                                            }
                                        >
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity +
                                                    1
                                                )
                                            }
                                            style={
                                                styles.quantityButton
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() =>
                                            removeItem(item.id)
                                        }
                                        style={styles.deleteButton}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={styles.summary}>
                        <div>
                            <span style={styles.totalLabel}>
                                Tổng tiền:
                            </span>

                            <strong style={styles.total}>
                                {formatPrice(total)} VNĐ
                            </strong>
                        </div>

                        <div style={styles.bottomActions}>
                            <button
                                onClick={() =>
                                    navigate(
                                        "/customer/rooms"
                                    )
                                }
                                style={
                                    styles.secondaryButton
                                }
                            >
                                Tiếp tục xem phòng
                            </button>

                            <button
                                onClick={clearCart}
                                style={styles.deleteAllButton}
                            >
                                Xóa giỏ hàng
                            </button>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/customer/checkout"
                                    )
                                }
                                style={styles.primaryButton}
                            >
                                Tiến hành đặt phòng
                            </button>
                        </div>
                    </div>
                </>
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
        backgroundColor: "white",
        padding: "50px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    },

    list: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    item: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    },

    itemInfo: {
        flex: 1,
    },

    roomName: {
        marginTop: 0,
        marginBottom: "10px",
    },

    actions: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },

    quantityGroup: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        overflow: "hidden",
    },

    quantityButton: {
        width: "36px",
        height: "36px",
        border: "none",
        backgroundColor: "#f3f4f6",
        cursor: "pointer",
        fontSize: "18px",
    },

    quantity: {
        minWidth: "40px",
        textAlign: "center",
        fontWeight: "600",
    },

    deleteButton: {
        padding: "9px 14px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#dc2626",
        color: "white",
        cursor: "pointer",
    },

    summary: {
        marginTop: "24px",
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    },

    totalLabel: {
        fontSize: "18px",
        marginRight: "12px",
    },

    total: {
        fontSize: "22px",
    },

    bottomActions: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        flexWrap: "wrap",
    },

    primaryButton: {
        padding: "11px 18px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontSize: "15px",
    },

    secondaryButton: {
        padding: "11px 18px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        backgroundColor: "white",
        color: "#374151",
        cursor: "pointer",
        fontSize: "15px",
    },

    deleteAllButton: {
        padding: "11px 18px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#dc2626",
        color: "white",
        cursor: "pointer",
        fontSize: "15px",
    },
};

export default Cart;