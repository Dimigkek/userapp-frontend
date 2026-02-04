import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userApi from "../api/userApi";

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
                        <h2 className="card-title">Edit Mode</h2>
                        <div className="card-section">
                            <label>Name:</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="edit-input" />

                            <label>Surname:</label>
                            <input name="surname" value={formData.surname} onChange={handleChange} className="edit-input" />

                            <label>Gender:</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="edit-input">
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>

                            <label>Home Address:</label>
                            <input name="homeAddress" value={formData.homeAddress} onChange={handleChange} className="edit-input" />

                            <label>Work Address:</label>
                            <input name="workAddress" value={formData.workAddress} onChange={handleChange} className="edit-input" />
                        </div>
                        <div className="button-group">
                            <button className="save-btn" onClick={handleUpdate}>Save Changes</button>
                            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
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