import { useState } from "react";
import api from "../api/axios";

export default function RegisterUser() {
    const [form, setForm] = useState({
        name: "",
        surname: "",
        gender: "",
        birthdate: "",
        addresses: [{ type: "", addressText: "" }]
    });

    const change = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        await api.post("/users", form);
        alert("Saved");
    };

    return (
        <div className="container">
            <h1>Register User</h1>

            <form onSubmit={submit}>
                <input name="name" placeholder="Name" onChange={change} />
                <input name="surname" placeholder="Surname" onChange={change} />
                <input name="gender" placeholder="Gender" onChange={change} />
                <input type="date" name="birthdate" onChange={change} />

                <h3>Address</h3>
                <input
                    placeholder="Type"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            addresses: [{ ...form.addresses[0], type: e.target.value }]
                        })
                    }
                />
                <input
                    placeholder="Address"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            addresses: [{ ...form.addresses[0], addressText: e.target.value }]
                        })
                    }
                />

                <button>Save</button>
            </form>
        </div>
    );
}
