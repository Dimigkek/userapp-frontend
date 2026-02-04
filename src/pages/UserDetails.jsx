import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../api/userApi";

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserById(id).then(res => setUser(res.data));
    }, [id]);

    if (!user) return <p className="page">Loading...</p>;

    const address = user.addresses?.[0];

    return (
        <div className="page">
            <h1 className="page-title">User Details</h1>

            <div className="card">
                <h2>{user.name} {user.surname}</h2>

                <p><b>Gender:</b> {user.gender}</p>
                <p><b>Birthdate:</b> {user.birthdate}</p>

                <hr />

                <p>
                    <b>Home Address:</b>{" "}
                    {address?.homeAddress ? address.homeAddress : "—"}
                </p>

                <p>
                    <b>Work Address:</b>{" "}
                    {address?.workAddress ? address.workAddress : "—"}
                </p>
            </div>

            <button onClick={() => navigate("/users")}>
                ← Back to Users
            </button>
        </div>
    );
}
