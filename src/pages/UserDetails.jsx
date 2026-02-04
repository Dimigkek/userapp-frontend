import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import "./CreateUser.css";

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        userApi.getUserById(id)
            .then(res => {
                setUser(res.data);
                setFormData(res.data);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        userApi.updateUser(id, formData)
            .then(res => {
                setUser(res.data);
                setIsEditing(false);
            })
            .catch(err => {
                console.error("Update error:", err);
                alert("Failed to update user.");
            });
    };

    if (!user) return <p className="page">Loading...</p>;

    return (
        <div className="page">
            <h1 className="page-title">User Profile</h1>

            <div className="card">
                {!isEditing ? (
                    <>
                        <h2 className="card-title">{user.name} {user.surname}</h2>
                        <div className="card-section">
                            <p><b>Gender:</b> {user.gender}</p>
                            <p><b>Birthdate:</b> {user.birthdate}</p>
                            <p><b>Home Address:</b> {user.homeAddress || "—"}</p>
                            <p><b>Work Address:</b> {user.workAddress || "—"}</p>
                        </div>
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </>
                ) : (
                    <>
                        <div className="card form-card">
                            <h2 className="card-title" style={{ color: 'white', marginBottom: '20px' }}>Edit User Profile</h2>

                            <label className="label">
                                <input
                                    className="input"
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="label">
                                Surname *
                                <input
                                    className="input"
                                    name="surname"
                                    value={formData.surname || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="label">
                                <select
                                    className="input"
                                    name="gender"
                                    value={formData.gender || ""}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="M">M</option>
                                    <option value="F">F</option>
                                    <option value="O">Other</option>
                                </select>
                            </label>

                            <label className="label">
                                <input
                                    type="date"
                                    className="input date-input"
                                    name="birthdate"
                                    value={formData.birthdate || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="label">
                                <textarea
                                    className="input textarea"
                                    name="homeAddress"
                                    value={formData.homeAddress || ""}
                                    onChange={handleChange}
                                    rows={1}
                                />
                            </label>

                            <label className="label">
                                Work Address
                                <textarea
                                    className="input textarea"
                                    name="workAddress"
                                    value={formData.workAddress || ""}
                                    onChange={handleChange}
                                    rows={1}
                                />
                            </label>

                            <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button className="primary-btn" onClick={handleUpdate} style={{ flex: 1 }}>
                                    Save Changes
                                </button>
                                <button className="cancel-btn" onClick={() => setIsEditing(false)} style={{ flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <button className="back-btn" onClick={() => navigate("/users")}>
                ← Back to Users
            </button>
        </div>
    );
}