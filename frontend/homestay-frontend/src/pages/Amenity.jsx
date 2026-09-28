import { useEffect, useState } from "react";
import { api } from "../services/api";

function Amenity() {
    const [amenities, setAmenities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [editingId, setEditingId] = useState(null);

    const loadAmenities = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/amenities?page=0&size=100&sortBy=id&direction=asc"
            );

            setAmenities(response.content || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAmenities();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
        });

        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");

            if (editingId) {
                await api.put(
                    `/amenities/${editingId}`,
                    form
                );
            } else {
                await api.post(
                    "/amenities",
                    form
                );
            }

            resetForm();
            await loadAmenities();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (amenity) => {
        setEditingId(amenity.id);

        setForm({
            name: amenity.name || "",
            description: amenity.description || "",
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa tiện nghi này?")) {
            return;
        }

        try {
            setError("");

            await api.delete(`/amenities/${id}`);

            await loadAmenities();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <div style={styles.header}>
                <h1>Quản lý tiện nghi</h1>

                <p style={styles.subtitle}>
                    Quản lý tiện nghi của Homestay
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
                        ? "Chỉnh sửa tiện nghi"
                        : "Thêm tiện nghi"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid}>

                        <div style={styles.formGroup}>
                            <label>Tên tiện nghi</label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="WiFi"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Mô tả</label>

                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="WiFi tốc độ cao"
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
                                : "Thêm tiện nghi"}
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
                <h2>Danh sách tiện nghi</h2>

                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : amenities.length === 0 ? (
                    <p>Chưa có tiện nghi nào.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Tên tiện nghi</th>
                            <th style={styles.th}>Mô tả</th>
                            <th style={styles.th}>Thao tác</th>
                        </tr>
                        </thead>

                        <tbody>
                        {amenities.map((amenity) => (
                            <tr key={amenity.id}>
                                <td style={styles.td}>
                                    {amenity.id}
                                </td>

                                <td style={styles.td}>
                                    {amenity.name}
                                </td>

                                <td style={styles.td}>
                                    {amenity.description || "-"}
                                </td>

                                <td style={styles.td}>
                                    <button
                                        onClick={() =>
                                            handleEdit(amenity)
                                        }
                                        style={styles.editButton}
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(amenity.id)
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

export default Amenity;