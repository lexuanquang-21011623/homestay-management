import { useEffect, useState } from "react";
import { api } from "../services/api";

function Customer() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
    });

    const [editingId, setEditingId] = useState(null);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/customers?page=0&size=100&sortBy=id&direction=asc"
            );

            setCustomers(response.content || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            fullName: "",
            phone: "",
            email: "",
            address: "",
        });

        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");

            if (editingId) {
                await api.put(
                    `/customers/${editingId}`,
                    form
                );
            } else {
                await api.post("/customers", form);
            }

            resetForm();
            await loadCustomers();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (customer) => {
        setEditingId(customer.id);

        setForm({
            fullName: customer.fullName || "",
            phone: customer.phone || "",
            email: customer.email || "",
            address: customer.address || "",
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) {
            return;
        }

        try {
            setError("");

            await api.delete(`/customers/${id}`);

            await loadCustomers();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <div style={styles.header}>
                <h1>Quản lý khách hàng</h1>

                <p style={styles.subtitle}>
                    Quản lý thông tin khách hàng
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
                        ? "Chỉnh sửa khách hàng"
                        : "Thêm khách hàng"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid}>

                        <div style={styles.formGroup}>
                            <label>Họ và tên</label>

                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Nguyễn Văn A"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Số điện thoại</label>

                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="0901234567"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Địa chỉ</label>

                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Hà Nội"
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
                                : "Thêm khách hàng"}
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
                <h2>Danh sách khách hàng</h2>

                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : customers.length === 0 ? (
                    <p>Chưa có khách hàng nào.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Họ và tên</th>
                            <th style={styles.th}>Số điện thoại</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Địa chỉ</th>
                            <th style={styles.th}>Thao tác</th>
                        </tr>
                        </thead>

                        <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td style={styles.td}>
                                    {customer.id}
                                </td>

                                <td style={styles.td}>
                                    {customer.fullName}
                                </td>

                                <td style={styles.td}>
                                    {customer.phone}
                                </td>

                                <td style={styles.td}>
                                    {customer.email || "-"}
                                </td>

                                <td style={styles.td}>
                                    {customer.address || "-"}
                                </td>

                                <td style={styles.td}>
                                    <button
                                        onClick={() =>
                                            handleEdit(customer)
                                        }
                                        style={styles.editButton}
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(customer.id)
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

export default Customer;