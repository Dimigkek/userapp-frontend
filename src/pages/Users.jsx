import { useEffect, useState, useCallback } from "react"; // Προσθήκη useCallback για σιγουριά
import { Link } from "react-router-dom";
import { getUsers, deleteUser } from "../api/userApi";
import "./Users.css";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    const loadUsers = useCallback((page) => {
        getUsers(page, 5)
            .then(res => {
                console.log("Response data:", res.data);

                setUsers(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);

            })
            .catch((err) => {
                console.error("API Error:", err);
                setUsers([]);
            });
    }, []);


    useEffect(() => {
        loadUsers(currentPage);
    }, [currentPage, loadUsers]);

    const handleDelete = async (id) => {
            try {
                await deleteUser(id);
                loadUsers(currentPage);
                // eslint-disable-next-line no-unused-vars
            } catch (e) {
                alert("Failed to delete user");
            }

    };

    return (
        <div className="page">
            <h1 className="page-title">Users</h1>

            <div className="card">
                {users.length === 0 && <p className="no-users">No users found</p>}

                <ul className="user-list">
                    {users.map(user => (
                        <li key={user.id} className="user-item">
                            <Link
                                to={`/users/${user.id}`}
                                className="user-link"
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

                {totalPages > 1 && (
                    <div className="pagination-controls">
                        {currentPage > 0 ? (
                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                &laquo; Previous
                            </button>
                        ) : (
                            <div style={{ width: "100px" }}></div>
                        )}

                        <span className="page-info">
            Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
        </span>

                        {currentPage + 1 < totalPages ? (
                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next &raquo;
                            </button>
                        ) : (
                            <div style={{ width: "100px" }}></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}