import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../api/userApi";

export default function Users() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const res = await getUsers();
        setUsers(res.data);
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        await deleteUser(id);
        loadUsers();
    };

    return (
        <div className="page">
            <h1 className="page-title">Users</h1>

            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr
                        key={u.id}
                        onClick={() => navigate(`/users/${u.id}`)}
                        className="clickable"
                    >
                        <td>{u.name}</td>
                        <td>{u.surname}</td>
                        <td>
                            <button
                                className="delete-btn"
                                onClick={(e) => handleDelete(u.id, e)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
