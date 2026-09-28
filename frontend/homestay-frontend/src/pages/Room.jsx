import { useEffect, useState } from "react";
import { api } from "../services/api";

function Room() {
    const [rooms, setRooms] = useState([]);
    const [properties, setProperties] = useState([]);

    const [form, setForm] = useState({
        name: "",
        roomNumber: "",
        capacity: "",
        price: "",
        availableQuantity: "",
        description: "",
        propertyId: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const loadProperties = async () => {
        try {
            const response = await api.get(
                "/properties?page=0&size=100&sortBy=id&direction=asc"
            );

            setProperties(response.content || []);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        loadRooms();
        loadProperties();
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
            roomNumber: "",
            capacity: "",
            price: "",
            availableQuantity: "",
            description: "",
            propertyId: "",
        });

        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        try {
            const body = {
                name: form.name,
                roomNumber: form.roomNumber,
                capacity: Number(form.capacity),
                price: Number(form.price),
                availableQuantity: Number(
                    form.availableQuantity
                ),
                description: form.description,
            };

            if (editingId) {
                await api.put(
                    `/rooms/${editingId}?propertyId=${form.propertyId}`,
                    body
                );

                setSuccess("Cập nhật phòng thành công");
            } else {
                await api.post(
                    `/rooms?propertyId=${form.propertyId}`,
                    body
                );

                setSuccess("Thêm phòng thành công");
            }

            resetForm();
            await loadRooms();

        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (room) => {
        setError("");
        setSuccess("");

        setEditingId(room.id);

        setForm({
            name: room.name || "",
            roomNumber: room.roomNumber || "",
            capacity: room.capacity || "",
            price: room.price || "",
            availableQuantity:
                room.availableQuantity ?? "",
            description: room.description || "",
            propertyId: room.property?.id || "",
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Bạn có chắc muốn xóa phòng này?"
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await api.delete(`/rooms/${id}`);

            setSuccess("Xóa phòng thành công");

            await loadRooms();

        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddToCart = async (room) => {
        setError("");
        setSuccess("");

        const userId = localStorage.getItem("userId");

        if (!userId) {
            setError(
                "Không tìm thấy userId. Hãy đăng nhập lại."
            );
            return;
        }

        if (
            room.availableQuantity === null ||
            room.availableQuantity <= 0
        ) {
            setError("Phòng này đã hết.");
            return;
        }

        try {
            await api.post(
                `/cart/${userId}/items`,
                {
                    roomId: room.id,
                    quantity: 1,
                }
            );

            setSuccess(
                `Đã thêm "${room.name}" vào giỏ hàng`
            );

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Quản lý phòng</h1>

            {error && (
                <div
                    style={{
                        color: "red",
                        marginBottom: "15px",
                    }}
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    style={{
                        color: "green",
                        marginBottom: "15px",
                    }}
                >
                    {success}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                style={{
                    marginBottom: "30px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                }}
            >
                <h2>
                    {editingId
                        ? "Sửa phòng"
                        : "Thêm phòng"}
                </h2>

                <div style={styles.formGroup}>
                    <label>Tên phòng</label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Số phòng</label>

                    <input
                        name="roomNumber"
                        value={form.roomNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Sức chứa</label>

                    <input
                        type="number"
                        name="capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Giá</label>

                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Số lượng phòng</label>

                    <input
                        type="number"
                        name="availableQuantity"
                        value={form.availableQuantity}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Mô tả</label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Cơ sở lưu trú</label>

                    <select
                        name="propertyId"
                        value={form.propertyId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            -- Chọn cơ sở lưu trú --
                        </option>

                        {properties.map((property) => (
                            <option
                                key={property.id}
                                value={property.id}
                            >
                                {property.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">
                    {editingId
                        ? "Cập nhật"
                        : "Thêm phòng"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={resetForm}
                        style={{
                            marginLeft: "10px",
                        }}
                    >
                        Hủy
                    </button>
                )}
            </form>

            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên phòng</th>
                    <th>Số phòng</th>
                    <th>Sức chứa</th>
                    <th>Giá</th>
                    <th>Còn lại</th>
                    <th>Cơ sở lưu trú</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                </tr>
                </thead>

                <tbody>
                {rooms.map((room) => (
                    <tr key={room.id}>
                        <td>{room.id}</td>

                        <td>{room.name}</td>

                        <td>{room.roomNumber}</td>

                        <td>{room.capacity}</td>

                        <td>
                            {Number(
                                room.price
                            ).toLocaleString(
                                "vi-VN"
                            )}{" "}
                            đ
                        </td>

                        <td>
                            {room.availableQuantity}
                        </td>

                        <td>
                            {room.property?.name}
                        </td>

                        <td>
                            {room.description}
                        </td>

                        <td>
                            <button
                                onClick={() =>
                                    handleAddToCart(
                                        room
                                    )
                                }
                                disabled={
                                    !room.availableQuantity ||
                                    room.availableQuantity <=
                                    0
                                }
                            >
                                Thêm vào giỏ
                            </button>

                            <button
                                onClick={() =>
                                    handleEdit(room)
                                }
                                style={{
                                    marginLeft: "5px",
                                }}
                            >
                                Sửa
                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(
                                        room.id
                                    )
                                }
                                style={{
                                    marginLeft: "5px",
                                }}
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    formGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "15px",
        maxWidth: "500px",
    },
};

export default Room;