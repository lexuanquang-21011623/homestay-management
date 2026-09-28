import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Checkout() {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("CASH");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const userId = localStorage.getItem("userId");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            if (!userId) {
                setError("Bạn chưa đăng nhập.");
                return;
            }

            // Lấy đúng giỏ hàng của tài khoản đang đăng nhập
            const cartResponse = await api.get(`/cart/${userId}`);
            setCart(cartResponse);

            // Lấy đúng Customer của tài khoản đang đăng nhập
            const customerResponse = await api.get(
                `/customers/user/${userId}`
            );

            setCustomer(customerResponse);
        } catch (error) {
            setError(
                error.message ||
                "Không thể tải thông tin đặt phòng."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("vi-VN");
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

    const handleCheckout = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            if (!userId) {
                setError("Bạn chưa đăng nhập.");
                return;
            }

            if (!customer?.id) {
                setError(
                    "Không tìm thấy thông tin khách hàng của tài khoản này."
                );
                return;
            }

            if (!cart?.items || cart.items.length === 0) {
                setError("Giỏ hàng đang trống.");
                return;
            }

            const response = await api.post(
                `/checkout/${userId}`,
                {
                    customerId: Number(customer.id),
                    paymentMethod: paymentMethod,
                }
            );

            setSuccess(
                `Đặt phòng thành công. Mã đặt phòng: ${
                    response.bookingIds?.join(", ") || "-"
                }`
            );

            setTimeout(() => {
                navigate("/customer/bookings");
            }, 1500);

        } catch (error) {
            setError(
                error.message ||
                "Đặt phòng thất bại. Vui lòng thử lại."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Thanh toán đặt phòng</h1>
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    const items = cart?.items || [];
    const total = calculateTotal();

    if (items.length === 0 && !success) {
        return (
            <div>
                <h1 style={styles.title}>
                    Thanh toán đặt phòng
                </h1>

                <div style={styles.empty}>
                    <h2>Giỏ hàng đang trống</h2>

                    <p>
                        Bạn cần chọn phòng trước khi thanh toán.
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
            </div>
        );
    }

    return (
        <div>
            <h1 style={styles.title}>
                Thanh toán đặt phòng
            </h1>

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

            {!success && (
                <div style={styles.container}>

                    <div style={styles.left}>

                        {/* Thông tin khách hàng */}
                        <div style={styles.card}>
                            <h2>Thông tin khách hàng</h2>

                            {customer && (
                                <div>
                                    <p>
                                        <strong>
                                            Họ tên:
                                        </strong>{" "}
                                        {customer.fullName}
                                    </p>

                                    <p>
                                        <strong>
                                            Số điện thoại:
                                        </strong>{" "}
                                        {customer.phone}
                                    </p>

                                    <p>
                                        <strong>
                                            Email:
                                        </strong>{" "}
                                        {customer.email || "-"}
                                    </p>

                                    <p>
                                        <strong>
                                            Địa chỉ:
                                        </strong>{" "}
                                        {customer.address || "-"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Danh sách phòng */}
                        <div style={styles.card}>
                            <h2>
                                Thông tin đặt phòng
                            </h2>

                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    style={styles.item}
                                >
                                    <div>
                                        <strong>
                                            {item.room?.name ||
                                                "Phòng"}
                                        </strong>

                                        <p>
                                            Phòng số:{" "}
                                            {item.room?.roomNumber ||
                                                "-"}
                                        </p>

                                        <p>
                                            Số lượng:{" "}
                                            {item.quantity}
                                        </p>
                                    </div>

                                    <strong>
                                        {formatPrice(
                                            Number(
                                                item.room?.price || 0
                                            ) *
                                            Number(
                                                item.quantity || 0
                                            )
                                        )}{" "}
                                        VNĐ
                                    </strong>
                                </div>
                            ))}
                        </div>

                        {/* Phương thức thanh toán */}
                        <div style={styles.card}>
                            <h2>
                                Phương thức thanh toán
                            </h2>

                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    value="CASH"
                                    checked={
                                        paymentMethod === "CASH"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                {" "}Thanh toán tiền mặt
                            </label>

                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    value="BANK_TRANSFER"
                                    checked={
                                        paymentMethod ===
                                        "BANK_TRANSFER"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                {" "}Chuyển khoản ngân hàng
                            </label>

                            <label style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    value="CARD"
                                    checked={
                                        paymentMethod === "CARD"
                                    }
                                    onChange={(event) =>
                                        setPaymentMethod(
                                            event.target.value
                                        )
                                    }
                                />

                                {" "}Thẻ
                            </label>
                        </div>
                    </div>

                    {/* Tổng tiền */}
                    <div style={styles.right}>
                        <div style={styles.summary}>
                            <h2>
                                Tổng đơn hàng
                            </h2>

                            <div style={styles.totalRow}>
                                <span>
                                    Tổng tiền
                                </span>

                                <strong style={styles.total}>
                                    {formatPrice(total)} VNĐ
                                </strong>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={submitting}
                                style={{
                                    ...styles.primaryButton,
                                    width: "100%",
                                    marginTop: "20px",
                                    opacity: submitting
                                        ? 0.6
                                        : 1,
                                }}
                            >
                                {submitting
                                    ? "Đang xử lý..."
                                    : "Xác nhận đặt phòng"}
                            </button>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/customer/cart"
                                    )
                                }
                                style={{
                                    ...styles.secondaryButton,
                                    width: "100%",
                                    marginTop: "10px",
                                }}
                            >
                                Quay lại giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    title: {
        marginBottom: "24px",
    },

    container: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "24px",
        alignItems: "start",
    },

    left: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },

    right: {
        position: "sticky",
        top: "20px",
    },

    card: {
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
    },

    item: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 0",
        borderBottom:
            "1px solid #e5e7eb",
        gap: "20px",
    },

    radioLabel: {
        display: "block",
        padding: "12px 0",
        cursor: "pointer",
    },

    summary: {
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
    },

    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "20px",
        marginTop: "20px",
        borderTop:
            "1px solid #e5e7eb",
    },

    total: {
        fontSize: "20px",
    },

    error: {
        padding: "12px 16px",
        marginBottom: "20px",
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "8px",
    },

    success: {
        padding: "16px",
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
        boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
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
};

export default Checkout;