import { useEffect, useState } from "react";
import { api } from "../services/api";

function Review() {
    const [reviews, setReviews] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        bookingId: "",
        rating: "5",
        comment: "",
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

    const loadReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/reviews?page=0&size=100&sortBy=id&direction=asc"
            );

            setReviews(response.content || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
        loadReviews();
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
            rating: "5",
            comment: "",
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

            const reviewData = {
                rating: Number(form.rating),
                comment: form.comment,
            };

            if (editingId) {
                await api.put(
                    `/reviews/${editingId}?bookingId=${form.bookingId}`,
                    reviewData
                );
            } else {
                await api.post(
                    `/reviews?bookingId=${form.bookingId}`,
                    reviewData
                );
            }

            resetForm();
            await loadReviews();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (review) => {
        setEditingId(review.id);

        setForm({
            bookingId: review.booking?.id || "",
            rating: review.rating || "5",
            comment: review.comment || "",
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
            return;
        }

        try {
            setError("");

            await api.delete(`/reviews/${id}`);

            await loadReviews();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <div style={styles.header}>
                <h1>Quản lý đánh giá</h1>

                <p style={styles.subtitle}>
                    Quản lý đánh giá của khách hàng
                </p>
            </div>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            <div style={styles.formCard}>
                <h2>
                    {editingId
                        ? "Chỉnh sửa đánh giá"
                        : "Thêm đánh giá"}
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
                                        {booking.customer?.fullName ||
                                            "Khách hàng"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Đánh giá</label>

                            <select
                                name="rating"
                                value={form.rating}
                                onChange={handleChange}
                                required
                            >
                                <option value="5">
                                    5 - Rất tốt
                                </option>

                                <option value="4">
                                    4 - Tốt
                                </option>

                                <option value="3">
                                    3 - Bình thường
                                </option>

                                <option value="2">
                                    2 - Không tốt
                                </option>

                                <option value="1">
                                    1 - Rất tệ
                                </option>
                            </select>
                        </div>

                        <div style={styles.formGroupFull}>
                            <label>Bình luận</label>

                            <textarea
                                name="comment"
                                value={form.comment}
                                onChange={handleChange}
                                placeholder="Nhập nội dung đánh giá"
                                rows="4"
                                required
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
                                : "Thêm đánh giá"}
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

            <div style={styles.tableCard}>
                <h2>Danh sách đánh giá</h2>

                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : reviews.length === 0 ? (
                    <p>Chưa có đánh giá nào.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Đặt phòng</th>
                            <th style={styles.th}>Khách hàng</th>
                            <th style={styles.th}>Đánh giá</th>
                            <th style={styles.th}>Bình luận</th>
                            <th style={styles.th}>Thao tác</th>
                        </tr>
                        </thead>

                        <tbody>
                        {reviews.map((review) => (
                            <tr key={review.id}>
                                <td style={styles.td}>
                                    {review.id}
                                </td>

                                <td style={styles.td}>
                                    #{review.booking?.id || "-"}
                                </td>

                                <td style={styles.td}>
                                    {review.booking?.customer?.fullName ||
                                        "-"}
                                </td>

                                <td style={styles.td}>
                                    {"⭐".repeat(review.rating || 0)}
                                </td>

                                <td style={styles.td}>
                                    {review.comment}
                                </td>

                                <td style={styles.td}>
                                    <button
                                        onClick={() =>
                                            handleEdit(review)
                                        }
                                        style={styles.editButton}
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(review.id)
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

    formGroupFull: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        gridColumn: "1 / -1",
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

export default Review;