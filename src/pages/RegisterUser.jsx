import { useState } from "react";
import api from "../api/axios";

export default function RegisterUser() {
    const [form, setForm] = useState({
        name: "",
        surname: "",
        gender: "",
        birthdate: "",
        addresses: [
            { type: "", addressText: "" }
        ]
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (index, e) => {
        const updated = [...form.addresses];
        updated[index][e.target.name] = e.target.value;
        setForm({ ...form, addresses: updated });
    };

    const addAddress = () => {
        setForm({
            ...form,
            addresses: [...form.addresses, { type: "", addressText: "" }]
        });
    };

    const removeAddress = (index) => {
        const updated = form.addresses.filter((_, i) => i !== index);
        setForm({ ...form, addresses: updated });
    };

    const submit = async (e) => {
        e.preventDefault();
        await api.post("/users", form);
        alert("User created");
    };

    return (
        <div className="form-container">
            <h2>Register New User</h2>

            <form onSubmit={submit}>
                <input name="name" placeholder="Name" onChange={handleChange} />
                <input name="surname" placeholder="Surname" onChange={handleChange} />

                <select name="gender" onChange={handleChange}>
                    <option value="">Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>

                <input
                    type="date"
                    name="birthdate"
                    onChange={handleChange}
                />

                <h3>Addresses</h3>

                {form.addresses.map((addr, i) => (
                    <div key={i} className="address-block">
                        <input
                            name="type"
                            placeholder="Type (HOME, WORK)"
                            onChange={(e) => handleAddressChange(i, e)}
                        />
                        <input
                            name="addressText"
                            placeholder="Address"
                            onChange={(e) => handleAddressChange(i, e)}
                        />
                        {form.addresses.length > 1 && (
                            <button type="button" onClick={() => removeAddress(i)}>
                                Remove
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addAddress}>
                    + Add Address
                </button>

                <button type="submit">Save User</button>
            </form>
        </div>
    );
}
