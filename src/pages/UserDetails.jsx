import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../api/userApi";

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserById(id).then((res) => setUser(res.data));
    }, [id]);

    if (!user) return <p className="page">Loading...</p>;

    const addressLabel = (type) => {
        if (type === "H") return "Home :";
        if (type === "W") return "Work :";
        return type;
    };


    return (
        <div className="page">
            <h1 className="page-title">User Details</h1>

            <div className="card">
                <h2 className="card-title">
                    {user.name} {user.surname}
                </h2>

                <div className="card-section">
                    <p><b>Gender:</b> {user.gender}</p>
                    <p><b>Birthdate:</b> {user.birthdate}</p>
                </div>

                <div className="card-section">
                    <h3>Address</h3>

                    {user.addresses.length === 0 && (
                        <p className="muted">No addresses</p>
                    )}

                    <ul className="address-list">
                        {user.addresses.map((a, idx) => (
                            <li key={idx} className="address-item">
                                <span className="address-type">
                                    {addressLabel(a.type)}
                                </span>
                                <span>{a.addressText}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button className="back-btn" onClick={() => navigate("/users")}>
                ← Back to Users
            </button>
        </div>
    );
}
