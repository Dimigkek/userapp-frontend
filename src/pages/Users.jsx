/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import userApi from "../api/userApi";
import "./Users.css";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const loadUsers = useCallback((page) => {
        setIsLoading(true);
        userApi.getUsers(page, 5)
            .then(res => {
                setUsers(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
            })
            .catch((err) => {
                console.error("API Error:", err);
                setUsers([]);
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        loadUsers(currentPage);
    }, [currentPage, loadUsers]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await userApi.deleteUser(id);

            if (users.length === 1 && currentPage > 0) {
                setCurrentPage(prev => prev - 1);
            } else {
                loadUsers(currentPage);
            }
        } catch (e) {
            alert("Failed to delete user. Make sure they are not owners of any tasks.");
        }
    };

    return (
        <div className="page">
            <div className="header-actions" style={{ marginBottom: '20px' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Users</h1>
            </div>

            <div className="card">
                {isLoading ? (
                    <p className="loading">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="no-users">No users found</p>
                ) : (
                    <ul className="user-list" style={{ listStyle: 'none', padding: 0 }}>
                        {users.map(user => (
                            <li key={user.id} className="user-item" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px 0',
                                borderBottom: '1px solid #1e293b'
                            }}>
                                <Link
                                    to={`/users/${user.id}`}
                                    className="user-link"
                                    style={{
                                        textDecoration: 'none',
                                        color: '#3b82f6', // Μπλε χρώμα για το Link
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = '#60a5fa'}
                                    onMouseOut={(e) => e.target.style.color = '#3b82f6'}
                                >
                                    {user.name} {user.surname}
                                </Link>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(user.id)}
                                    style={{
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {totalPages > 1 && (
                    <div className="pagination-controls" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                        marginTop: '30px',
                        borderTop: '1px solid #1f2937',
                        paddingTop: '20px'
                    }}>
                        <button
                            className="secondary-btn"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            style={{ opacity: currentPage === 0 ? 0.4 : 1, minWidth: '100px' }}
                        >
                            &laquo; Previous
                        </button>

                        <span className="page-info" style={{ color: '#94a3b8' }}>
                            Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
                        </span>

                        <button
                            className="secondary-btn"
                            disabled={currentPage + 1 >= totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            style={{ opacity: currentPage + 1 >= totalPages ? 0.4 : 1, minWidth: '100px' }}
                        >
                            Next &raquo;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}