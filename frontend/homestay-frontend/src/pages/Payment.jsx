import { useEffect, useState } from "react";
import { api } from "../services/api";

function getPaymentMethodLabel(method) {
    const labels = {
        CASH: "Tiền mặt",
        BANK_TRANSFER: "Chuyển khoản",
        CARD: "Thẻ ngân hàng",
        MOMO: "Ví MoMo",
        SEPAY: "SePay",
    };

    return labels[method] || method || "-";
}

function getPaymentStatusLabel(status) {
    const labels = {
        PENDING: "Chờ thanh toán",
        PAID: "Đã thanh toán",
        FAILED: "Thanh toán thất bại",
        REFUNDED: "Đã hoàn tiền",
    };

    return labels[status] || status || "-";
}

function Payment() {
    const [payments, setPayments] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        bookingId: "",
        amount: "",
        paymentMethod: "CASH",
        status: "PENDING",
        paymentDate: "",
        transactionCode: "",
    });

    const [editingId, setEditingId] = useState(null);

    const loadBookings = async () => {
        try {
            const response = await api.get(
                "/bookings?page=0&size=100&sortBy=id&direction=asc"
            );

            setBookings(response.content || []);
        } catch (error) {
            setError(error.message);
        }
    };

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/payments?page=0&size=100&sortBy=id&direction=asc"
            );

            setPayments(response.content || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
        loadPayments();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            bookingId: "",
            amount: "",
            paymentMethod: "CASH",
            status: "PENDING",
            paymentDate: "",
            transactionCode: "",
        });

        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");

            if (!form.bookingId) {
                setError("Vui lòng chọn đặt phòng.");
                return;
            }

            const paymentData = {
                amount: Number(form.amount),
                paymentMethod: form.paymentMethod,
                status: form.status,
                paymentDate: form.paymentDate || null,
                transactionCode: form.transactionCode,
            };

            if (editingId) {
                await api.put(
                    `/payments/${editingId}?bookingId=${form.bookingId}`,
                    paymentData
                );
            } else {
                await api.post(
                    `/payments?bookingId=${form.bookingId}`,
                    paymentData
                );
            }

            resetForm();
            await loadPayments();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (payment) => {
        setEditingId(payment.id);

        setForm({
            bookingId: payment.booking?.id || "",
            amount: payment.amount || "",
            paymentMethod: payment.paymentMethod || "CASH",
            status: payment.status || "PENDING",
            paymentDate: payment.paymentDate || "",
            transactionCode: payment.transactionCode || "",
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa thanh toán này?")) {
            return;
        }

        try {
            setError("");

            await api.delete(`/payments/${id}`);

            await loadPayments();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <div style={styles.header}>
                <h1>Quản lý thanh toán</h1>

                <p style={styles.subtitle}>
                    Quản lý thanh toán của các Booking
                </p>
            </div>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {/* FORM */}
            <div style={styles.formCard}>
                <h2>
                    {editingId
                        ? "Chỉnh sửa thanh toán"
                        : "Thêm thanh toán"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid}>

                        <div style={styles.formGroup}>
                            <label>Đặt phòng</label>

                            <select
                                name="bookingId"
                                value={form.bookingId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    -- Chọn đặt phòng --
                                </option>

                                {bookings.map((booking) => (
                                    <option
                                        key={booking.id}
                                        value={booking.id}
                                    >
                                        Đặt phòng #{booking.id}
                                        {" - "}
                                        {booking.customer?.fullName || "Khách hàng"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Số tiền</label>

                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="1000000"
                                min="1"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Phương thức thanh toán</label>

                            <select
                                name="paymentMethod"
                                value={form.paymentMethod}
                                onChange={handleChange}
                            >
                                <option value="CASH">
                                    Tiền mặt
                                </option>

                                <option value="BANK_TRANSFER">
                                    Chuyển khoản
                                </option>

                                <option value="CARD">
                                    Thẻ ngân hàng
                                </option>

                                <option value="MOMO">
                                    Ví MoMo
                                </option>

                                <option value="SEPAY">
                                    SePay
                                </option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Trạng thái</label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="PENDING">
                                    Chờ thanh toán
                                </option>

                                <option value="PAID">
                                    Đã thanh toán
                                </option>

                                <option value="FAILED">
                                    Thanh toán thất bại
                                </option>

                                <option value="REFUNDED">
                                    Đã hoàn tiền
                                </option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Ngày thanh toán</label>

                            <input
                                type="datetime-local"
                                name="paymentDate"
                                value={form.paymentDate || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Mã giao dịch</label>

                            <input
                                type="text"
                                name="transactionCode"
                                value={form.transactionCode}
                                onChange={handleChange}
                                placeholder="VD: GD123456"
                            />
                        </div>

                    </div>

                    <div style={styles.buttonGroup}>
                        <button
                            type="submit"
                            style={styles.primaryButton}
                        >
                            {editingId
                                ? "Cập nhật"
                                : "Thêm thanh toán"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={styles.cancelButton}
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* TABLE */}
            <div style={styles.tableCard}>
                <h2>Danh sách thanh toán</h2>

                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : payments.length === 0 ? (
                    <p>Chưa có thanh toán nào.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Đặt phòng</th>
                            <th style={styles.th}>Khách hàng</th>
                            <th style={styles.th}>Số tiền</th>
                            <th style={styles.th}>Phương thức</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Ngày thanh toán</th>
                            <th style={styles.th}>Mã giao dịch</th>
                            <th style={styles.th}>Thao tác</th>
                        </tr>
                        </thead>

                        <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td style={styles.td}>
                                    {payment.id}
                                </td>

                                <td style={styles.td}>
                                    #{payment.booking?.id || "-"}
                                </td>

                                <td style={styles.td}>
                                    {payment.booking?.customer?.fullName || "-"}
                                </td>

                                <td style={styles.td}>
                                    {payment.amount?.toLocaleString(
                                        "vi-VN"
                                    )}{" "}
                                    VNĐ
                                </td>

                                <td style={styles.td}>
                                    {getPaymentMethodLabel(payment.paymentMethod)}
                                </td>

                                <td style={styles.td}>
                                    {getPaymentStatusLabel(payment.status)}
                                </td>

                                <td style={styles.td}>
                                    {payment.paymentDate || "-"}
                                </td>

                                <td style={styles.td}>
                                    {payment.transactionCode || "-"}
                                </td>

                                <td style={styles.td}>
                                    <button
                                        onClick={() =>
                                            handleEdit(payment)
                                        }
                                        style={styles.editButton}
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(payment.id)
                                        }
                                        style={styles.deleteButton}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const styles = {
    header: {
        marginBottom: "20px",
    },

    subtitle: {
        color: "#6b7280",
    },

    error: {
        padding: "12px",
        marginBottom: "20px",
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "8px",
    },

    formCard: {
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        marginBottom: "24px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
    },

    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },

    buttonGroup: {
        marginTop: "20px",
        display: "flex",
        gap: "10px",
    },

    primaryButton: {
        padding: "10px 18px",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },

    cancelButton: {
        padding: "10px 18px",
        backgroundColor: "#6b7280",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },

    tableCard: {
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
    },

    th: {
        textAlign: "left",
        padding: "12px",
        borderBottom: "2px solid #e5e7eb",
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #e5e7eb",
    },

    editButton: {
        padding: "7px 12px",
        marginRight: "8px",
        backgroundColor: "#f59e0b",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },

    deleteButton: {
        padding: "7px 12px",
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Payment;