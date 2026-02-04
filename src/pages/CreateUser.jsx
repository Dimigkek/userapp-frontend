import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/userApi";

export default function CreateUser() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        surname: "",
        gender: "",
        birthdate: "",
        addressType: "",
        addressText: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const payload = {
            name: form.name,
            surname: form.surname,
            gender: form.gender,
            birthdate: form.birthdate,
            addresses: [
                {
                    type: form.addressType,   // H or W
                    addressText: form.addressText
                }
            ]
        };

        try {
            await createUser(payload);
            navigate("/users");
        } catch (err) {
            console.error(err);
            setError("Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <h1 className="page-title">Register New User</h1>

            <form className="form" onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="surname"
                    placeholder="Surname"
                    value={form.surname}
                    onChange={handleChange}
                    required
                />

                <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>

                <input
                    type="date"
                    name="birthdate"
                    value={form.birthdate}
                    onChange={handleChange}
                    required
                />

                <hr />

                <select
                    name="addressType"
                    value={form.addressType}
                    onChange={handleChange}
                    required
                >
                    <option value="">Address type</option>
                    <option value="H">Home</option>
                    <option value="W">Work</option>
                </select>

                <input
                    name="addressText"
                    placeholder="Address"
                    value={form.addressText}
                    onChange={handleChange}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
}
