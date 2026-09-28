import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email: form.email,
                password: form.password,
            });

            localStorage.setItem("token", response.token);
            localStorage.setItem("userId", response.userId);
            localStorage.setItem("fullName", response.fullName);
            localStorage.setItem("email", response.email);
            localStorage.setItem("role", response.role);

            if (response.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/customer");
            }
        } catch (error) {
            setError(error.message || "Email hoặc mật khẩu không chính xác.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Homestay</h1>

                <p style={styles.subtitle}>
                    Đăng nhập hệ thống
                </p>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Mật khẩu</label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
    },

    card: {
        width: "400px",
        padding: "32px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    },

    title: {
        textAlign: "center",
        marginBottom: "8px",
    },

    subtitle: {
        textAlign: "center",
        color: "#6b7280",
        marginBottom: "24px",
    },

    error: {
        padding: "12px",
        marginBottom: "16px",
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        borderRadius: "6px",
    },

    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        marginBottom: "16px",
    },

    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default Login;