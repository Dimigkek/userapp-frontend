import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userApi from "../api/userApi";

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        userApi.getUserById(id)
            .then(res => {
                console.log("User details response:", res.data); // DEBUG
                setUser(res.data);
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!user) return <p className="page">Loading...</p>;

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

                <hr className="divider" />

                <div className="card-section">
                    <p>
                        <b>Home Address:</b>{" "}
                        {user.homeAddress ? user.homeAddress : "—"}
                    </p>
                    <p>
                        <b>Work Address:</b>{" "}
                        {user.workAddress ? user.workAddress : "—"}
                    </p>
                </div>
            </div>

            <button className="back-btn" onClick={() => navigate("/users")}>
                ← Back to Users
            </button>
        </div>
    );
}
