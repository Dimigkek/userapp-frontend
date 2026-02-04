import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, deleteUser } from "../api/userApi";

export default function Users() {
    const [users, setUsers] = useState([]);

    const loadUsers = () => {
        getUsers()
            .then(res => setUsers(res.data))
            .catch(() => setUsers([]));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {

        try {
            await deleteUser(id);
            loadUsers();
        } catch (e) {
            alert("Failed to delete user");
        }
    };

    return (
        <div className="page">
            <h1 className="page-title">Users</h1>

            <div className="card">
                {users.length === 0 && <p>No users found</p>}

                <ul className="user-list">
                    {users.map(user => (
                        <li key={user.id} className="user-item">
                            <Link
                                to={`/users/${user.id}`}
                                className="user-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {user.name} {user.surname}
                            </Link>

                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(user.id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
