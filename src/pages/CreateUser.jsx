import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import "./CreateUser.css";

export default function CreateUser() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        surname: "",
        gender: "",
        birthdate: "",
        homeAddress: "",
        workAddress: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            surname: form.surname,
            gender: form.gender,
            birthdate: form.birthdate,
            homeAddress: form.homeAddress || null,
            workAddress: form.workAddress || null
        };


        try {
            await userApi.createUser(payload);
            navigate("/users");
        } catch (err) {
            console.error("Failed to create user", err);
            alert("Failed to create user");
        }
    };

    return (
        <div className="page">
            <h1 className="page-title">Register New User</h1>

            <form className="card form-card" onSubmit={handleSubmit}>
                <label>
                    Name *
                    <input
                        className="input"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Surname *
                    <input
                        className="input"
                        name="surname"
                        value={form.surname}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Gender *
                    <select
                        className="input"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                </label>

                <label>
                    Birthdate *
                    <input
                        type="date"
                        className="input date-input"
                        name="birthdate"
                        value={form.birthdate}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Home Address
                    <textarea
                        className="input textarea"
                        name="homeAddress"
                        value={form.homeAddress}
                        onChange={handleChange}
                        rows={2}
                    />
                </label>

                <label>
                    Work Address
                    <textarea
                        className="input textarea"
                        name="workAddress"
                        value={form.workAddress}
                        onChange={handleChange}
                        rows={2}
                    />
                </label>

                <button type="submit" className="primary-btn">
                    Save
                </button>
            </form>
        </div>
    );
}
