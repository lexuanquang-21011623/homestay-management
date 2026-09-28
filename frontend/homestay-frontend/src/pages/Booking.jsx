import { useEffect, useState } from "react";
import { api } from "../services/api";

function getBookingStatusLabel(status) {
    const labels = {
        PENDING: "Chờ xác nhận",
        CONFIRMED: "Đã xác nhận",
        CHECKED_IN: "Đã nhận phòng",
        CHECKED_OUT: "Đã trả phòng",
        CANCELLED: "Đã hủy",
    };

    return labels[status] || status || "-";
}

function Booking() {
    const [bookings, setBookings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        customerId: "",
        roomId: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: "",
        totalPrice: "",
        status: "PENDING",
    });

    const [editingId, setEditingId] = useState(null);

    const loadCustomers = async () => {
        try {
            const response = await api.get(
                "/customers?page=0&size=100&sortBy=id&direction=asc"
            );

            setCustomers(response.content || []);
        } catch (error) {
            setError(error.message);
        }
    };

    const loadRooms = async () => {
        try {
            const response = await api.get(
                "/rooms?page=0&size=100&sortBy=id&direction=asc"
            );

            setRooms(response.content || []);
        } catch (error) {
            setError(error.message);
        }
    };

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/bookings?page=0&size=100&sortBy=id&direction=asc"
            );

            setBookings(response.content || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
        loadRooms();
        loadBookings();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            customerId: "",
            roomId: "",
            checkInDate: "",
            checkOutDate: "",
            numberOfGuests: "",
            totalPrice: "",
            status: "PENDING",
        });

        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");

            if (!form.customerId) {
                setError("Vui lòng chọn khách hàng.");
                return;
            }

            if (!form.roomId) {
                setError("Vui lòng chọn phòng.");
                return;
            }

            const bookingData = {
                checkInDate: form.checkInDate,
                checkOutDate: form.checkOutDate,
                numberOfGuests: Number(form.numberOfGuests),
                totalPrice: Number(form.totalPrice),
                status: form.status,
            };

            if (editingId) {
                await api.put(
                    `/bookings/${editingId}?customerId=${form.customerId}&roomId=${form.roomId}`,
                    bookingData
                );
            } else {
                await api.post(
                    `/bookings?customerId=${form.customerId}&roomId=${form.roomId}`,
                    bookingData
                );
            }

            resetForm();
            await loadBookings();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (booking) => {
        setEditingId(booking.id);

        setForm({
            customerId: booking.customer?.id || "",
            roomId: booking.room?.id || "",
            checkInDate: booking.checkInDate || "",
            checkOutDate: booking.checkOutDate || "",
            numberOfGuests: booking.numberOfGuests || "",
            totalPrice: booking.totalPrice || "",
            status: booking.status || "PENDING",
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa đặt phòng này?")) {
            return;
        }

        try {
            setError("");

            await api.delete(`/bookings/${id}`);

            await loadBookings();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <div style={styles.header}>
                <h1>Quản lý đặt phòng</h1>

                <p style={styles.subtitle}>
                    Quản lý đặt phòng của khách hàng
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
                        ? "Chỉnh sửa đặt phòng"
                        : "Thêm đặt phòng"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid}>

                        <div style={styles.formGroup}>
                            <label>Khách hàng</label>

                            <select
                                name="customerId"
                                value={form.customerId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    -- Chọn khách hàng --
                                </option>

                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Phòng</label>

                            <select
                                name="roomId"
                                value={form.roomId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    -- Chọn phòng --
                                </option>

                                {rooms.map((room) => (
                                    <option
                                        key={room.id}
                                        value={room.id}
                                    >
                                        {room.name} - {room.roomNumber}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Ngày nhận phòng</label>

                            <input
                                type="date"
                                name="checkInDate"
                                value={form.checkInDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Ngày trả phòng</label>

                            <input
                                type="date"
                                name="checkOutDate"
                                value={form.checkOutDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Số khách</label>

                            <input
                                type="number"
                                name="numberOfGuests"
                                value={form.numberOfGuests}
                                onChange={handleChange}
                                min="1"
                                placeholder="2"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Tổng tiền</label>

                            <input
                                type="number"
                                name="totalPrice"
                                value={form.totalPrice}
                                onChange={handleChange}
                                min="1"
                                placeholder="1000000"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Trạng thái</label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="PENDING">
                                    Chờ xác nhận
                                </option>

                                <option value="CONFIRMED">
                                    Đã xác nhận
                                </option>

                                <option value="CHECKED_IN">
                                    Đã nhận phòng
                                </option>

                                <option value="CHECKED_OUT">
                                    Đã trả phòng
                                </option>

                                <option value="CANCELLED">
                                    Đã hủy
                                </option>
                            </select>
                        </div>

                    </div>

                    <div style={styles.buttonGroup}>
                        <button
                            type="submit"
                            style={styles.primaryButton}
                        >
                            {editingId
                                ? "Cập nhật"
                                : "Thêm đặt phòng"}
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
                <h2>Danh sách đặt phòng</h2>

                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : bookings.length === 0 ? (
                    <p>Chưa có đặt phòng nào.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Khách hàng</th>
                            <th style={styles.th}>Phòng</th>
                            <th style={styles.th}>Ngày nhận phòng</th>
                            <th style={styles.th}>Ngày trả phòng</th>
                            <th style={styles.th}>Số khách</th>
                            <th style={styles.th}>Tổng tiền</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Thao tác</th>
                        </tr>
                        </thead>

                        <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td style={styles.td}>
                                    {booking.id}
                                </td>

                                <td style={styles.td}>
                                    {booking.customer?.fullName || "-"}
                                </td>

                                <td style={styles.td}>
                                    {booking.room?.name || "-"}
                                </td>

                                <td style={styles.td}>
                                    {booking.checkInDate}
                                </td>

                                <td style={styles.td}>
                                    {booking.checkOutDate}
                                </td>

                                <td style={styles.td}>
                                    {booking.numberOfGuests}
                                </td>

                                <td style={styles.td}>
                                    {booking.totalPrice?.toLocaleString(
                                        "vi-VN"
                                    )}{" "}
                                    VNĐ
                                </td>

                                <td style={styles.td}>
                                    {getBookingStatusLabel(booking.status)}
                                </td>

                                <td style={styles.td}>
                                    <button
                                        onClick={() =>
                                            handleEdit(booking)
                                        }
                                        style={styles.editButton}
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(booking.id)
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

export default Booking;